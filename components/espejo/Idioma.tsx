'use client';
/*
 * Idioma: the official "IDIOMA »" trigger (Google Language Translator), fixed bottom right. Google's
 * script (translate_a/element.js) loads only after the first click, then the panel offers the official
 * ten languages plus Google's own selector. Choosing Español restores the original page. No props.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { WIDGETS } from '@/lib/oficial/menu';
import './espejo-chrome.css';

const SCRIPT_ID = 'wb-google-translate';
const CONTENEDOR = 'google_language_translator';
// Order and languages of the official flags.
const IDIOMAS: { codigo: string; nombre: string; titulo: string }[] = [
  { codigo: 'es', nombre: 'Español', titulo: 'Spanish' },
  { codigo: 'en', nombre: 'English', titulo: 'English' },
  { codigo: 'zh-TW', nombre: '中文（繁體）', titulo: 'Chinese (Traditional)' },
  { codigo: 'nl', nombre: 'Nederlands', titulo: 'Dutch' },
  { codigo: 'fr', nombre: 'Français', titulo: 'French' },
  { codigo: 'de', nombre: 'Deutsch', titulo: 'German' },
  { codigo: 'it', nombre: 'Italiano', titulo: 'Italian' },
  { codigo: 'ja', nombre: '日本語', titulo: 'Japanese' },
  { codigo: 'ko', nombre: '한국어', titulo: 'Korean' },
  { codigo: 'ru', nombre: 'Русский', titulo: 'Russian' },
];

type Estado = 'inactivo' | 'cargando' | 'listo' | 'error';
type VentanaGoogle = Window & {
  GoogleLanguageTranslatorInit?: () => void;
  google?: { translate?: { TranslateElement?: new (opciones: Record<string, unknown>, id: string) => unknown } };
};

const traducida = () => document.documentElement.classList.contains('translated-ltr') || document.documentElement.classList.contains('translated-rtl') || /(?:^|;\s*)googtrans=/.test(document.cookie);

export default function Idioma() {
  const [abierto, setAbierto] = useState(false);
  const [estado, setEstado] = useState<Estado>('inactivo');
  const [activo, setActivo] = useState('es');
  const raiz = useRef<HTMLDivElement>(null), boton = useRef<HTMLButtonElement>(null);
  const pendiente = useRef<string | null>(null), sondeo = useRef(0);

  const cargar = useCallback(() => {
    const ventana = window as VentanaGoogle;
    // Builds Google's selector in this instance's container (also after a remount, when the script is already here).
    const iniciar = () => {
      const Elemento = ventana.google?.translate?.TranslateElement;
      if (!Elemento) { setEstado('error'); return; }
      const contenedor = document.getElementById(CONTENEDOR);
      if (contenedor && !contenedor.childElementCount) new Elemento({ pageLanguage: 'es', autoDisplay: false }, CONTENEDOR);
      setEstado('listo');
    };
    ventana.GoogleLanguageTranslatorInit = iniciar;
    if (ventana.google?.translate?.TranslateElement) { iniciar(); return; }
    setEstado('cargando');
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=GoogleLanguageTranslatorInit';
    script.async = true;
    script.onerror = () => { script.remove(); setEstado('error'); };
    document.body.appendChild(script);
  }, []);

  // Google builds its <select class="goog-te-combo"> asynchronously: wait for it, then apply the choice.
  const aplicar = useCallback(() => {
    window.clearInterval(sondeo.current);
    let intentos = 0;
    sondeo.current = window.setInterval(() => {
      const combo = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
      if (combo && pendiente.current) {
        combo.value = pendiente.current;
        combo.dispatchEvent(new Event('change'));
        setActivo(pendiente.current);
        pendiente.current = null;
      }
      if (!pendiente.current || ++intentos > 50) window.clearInterval(sondeo.current);
    }, 200);
  }, []);

  useEffect(() => { if (estado === 'listo' && pendiente.current) aplicar(); }, [estado, aplicar]);
  useEffect(() => () => window.clearInterval(sondeo.current), []);
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (event: PointerEvent) => { if (raiz.current && !raiz.current.contains(event.target as Node)) setAbierto(false); };
    document.addEventListener('pointerdown', alPulsar);
    return () => document.removeEventListener('pointerdown', alPulsar);
  }, [abierto]);

  function traducir(codigo: string) {
    if (codigo === 'es') {
      pendiente.current = null;
      if (!traducida()) { setActivo('es'); return; }
      // Google keeps the translation in a cookie: clearing it and reloading shows the original page.
      const caduca = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = `googtrans=; ${caduca}`;
      document.cookie = `googtrans=; ${caduca}; domain=${location.hostname}`;
      document.cookie = `googtrans=; ${caduca}; domain=.${location.hostname.replace(/^www\./, '')}`;
      location.reload();
      return;
    }
    pendiente.current = codigo;
    if (estado === 'listo') aplicar(); else cargar();
  }

  return <div ref={raiz} className="wb-idioma notranslate" translate="no" data-abierto={abierto || undefined}
    onKeyDown={event => { if (event.key === 'Escape' && abierto) { event.preventDefault(); setAbierto(false); boton.current?.focus(); } }}>
    <div id="wb-idioma-panel" className="wb-idioma-panel" role="region" aria-label="Traducir esta página" hidden={!abierto}>
      <ul className="wb-idioma-lista">
        {IDIOMAS.map(idioma => <li key={idioma.codigo}>
          <button type="button" lang={idioma.codigo} title={idioma.titulo} aria-pressed={activo === idioma.codigo} onClick={() => traducir(idioma.codigo)}>{idioma.nombre}</button>
        </li>)}
      </ul>
      <div id={CONTENEDOR} className="wb-idioma-google"/>
      <p className="wb-idioma-estado" role="status">{estado === 'cargando' ? 'Cargando el traductor…' : estado === 'error' ? 'No se pudo cargar el traductor de Google. Inténtalo de nuevo.' : ''}</p>
    </div>
    <button ref={boton} type="button" className="wb-idioma-boton" aria-expanded={abierto} aria-controls="wb-idioma-panel"
      onClick={() => { const siguiente = !abierto; setAbierto(siguiente); if (siguiente && estado !== 'listo') cargar(); }}>
      {WIDGETS.idioma.boton}
    </button>
  </div>;
}
