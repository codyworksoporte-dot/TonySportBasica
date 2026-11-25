/*
 * Build-time helpers that read optional files with node:fs. Server only: import them from app/layout.tsx
 * or other server components, never from client code (this module is not re-exported by index.ts).
 */
import fs from 'node:fs';
import path from 'node:path';
import { siteAsset } from '@/lib/asset-path';
import { PIE } from '@/lib/oficial/menu';

/** Footer audio: local src (already through siteAsset) plus what data/oficial/medios.json knows about it. */
export type AudioPie = { src: string; tipo?: string; duracion?: string; etiqueta?: string };

const AUDIO = /\.(mp3|m4a|aac|ogg|oga|opus|wav|webm|flac)$/i;
const texto = (valor: unknown) => (typeof valor === 'string' && valor.trim() ? valor.trim() : undefined);

/**
 * Local copy of the footer audio listed in data/oficial/medios.json (written by the media mirror); null when
 * the file, the entry or the audio file does not exist yet. Accepts a map or a list and picks the
 * /assets/... audio whose entry mentions the official file name.
 */
export function audioLocalDelPie(): AudioPie | null {
  try {
    const raiz = process.cwd();
    const archivo = path.join(raiz, 'data', 'oficial', 'medios.json');
    if (!fs.existsSync(archivo)) return null;
    const datos: unknown = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    const candidatos: { local: string; contexto: string; entrada: Record<string, unknown> }[] = [];
    const visitar = (nodo: unknown, clave: string) => {
      if (Array.isArray(nodo)) { nodo.forEach(n => visitar(n, clave)); return; }
      if (!nodo || typeof nodo !== 'object') return;
      const entrada = nodo as Record<string, unknown>;
      const pares = Object.entries(entrada);
      const contexto = [clave, ...pares.filter(([, v]) => typeof v === 'string').map(([, v]) => v as string)].join(' ');
      for (const [k, v] of pares) {
        const limpio = typeof v === 'string' ? v.split(/[?#]/)[0] : '';
        if (limpio.startsWith('/assets/') && AUDIO.test(limpio)) candidatos.push({ local: limpio, contexto: `${contexto} ${k}`, entrada });
        else if (v && typeof v === 'object') visitar(v, k);
      }
    };
    visitar(datos, '');
    const oficial = path.basename(PIE.informacion.audio).replace(/\.[a-z0-9]+$/i, '');
    const elegido = candidatos.find(c => c.contexto.includes(oficial)) ?? candidatos[0];
    if (!elegido || !fs.existsSync(path.join(raiz, 'public', elegido.local))) return null;
    const duracion = texto(elegido.entrada.duracion);
    return {
      src: siteAsset(elegido.local as `/assets/${string}`),
      tipo: texto(elegido.entrada.tipo) ?? texto(elegido.entrada.type),
      duracion: duracion && /^\d{1,2}:\d{2}(:\d{2})?$/.test(duracion) ? duracion : undefined,
      etiqueta: texto(elegido.entrada.etiqueta),
    };
  } catch {
    return null;
  }
}
