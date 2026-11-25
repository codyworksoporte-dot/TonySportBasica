'use client';
/*
 * BuscadorLateral: the sidebar search widget (WordPress searchform: field, hidden "Buscar:" label, magnifier
 * button). The static mirror has no WordPress search page, so it looks the words up in the catalogue it
 * receives (products and categories, resolved on the server) and lists the matches under the field.
 * Props: indice ({ texto, href }[]: local routes); maximo? (results shown, default 12).
 */
import Link from 'next/link';
import { useId, useMemo, useState, type FormEvent } from 'react';
import Icon from '@/components/Icon';

export type EntradaBusqueda = { texto: string; href: string };
type Props = { indice: EntradaBusqueda[]; maximo?: number };

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

export default function BuscadorLateral({ indice, maximo = 12 }: Props) {
  const id = useId();
  const [valor, setValor] = useState('');
  const [consulta, setConsulta] = useState<string | null>(null);
  const normalizado = useMemo(() => indice.map((entrada) => ({ ...entrada, clave: normalizar(entrada.texto) })), [indice]);
  const resultados = useMemo(() => {
    if (!consulta) return [];
    const palabras = normalizar(consulta).split(' ').filter(Boolean);
    return normalizado.filter((entrada) => palabras.every((palabra) => entrada.clave.includes(palabra)));
  }, [consulta, normalizado]);

  function buscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setConsulta(valor.trim());
  }

  return <form role="search" className="wb-contenido-buscar" onSubmit={buscar}>
    <label htmlFor={id} className="sr-only">Buscar:</label>
    <div className="wb-contenido-buscar-campo">
      <input id={id} type="search" name="s" value={valor} onChange={(evento) => setValor(evento.target.value)} autoComplete="off" enterKeyHint="search"/>
      <button type="submit" aria-label="Buscar"><Icon name="search" size={16}/></button>
    </div>
    <div className="wb-contenido-buscar-resultados" aria-live="polite">
      {consulta && (resultados.length ? <>
        <p className="sr-only">{resultados.length === 1 ? '1 resultado' : `${resultados.length} resultados`}</p>
        <ul>{resultados.slice(0, maximo).map((entrada) => <li key={entrada.href}><Link href={entrada.href} prefetch={false}>{entrada.texto}</Link></li>)}</ul>
      </> : <p>Sin resultados.</p>)}
    </div>
  </form>;
}
