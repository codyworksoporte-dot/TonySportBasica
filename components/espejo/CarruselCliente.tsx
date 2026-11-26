'use client';
/*
 * CarruselCliente: the interactive part of <Carrusel> (use Carrusel, which resolves the official images on
 * the server so the image map never reaches the browser). Fades, autoplay, arrows, dots, swipe, arrow keys;
 * pauses on hover, on focus, while the tab is hidden and with its pause button; no autoplay or fades with
 * prefers-reduced-motion or html[data-tony-effects=off]. Only the current slide and its neighbours load.
 * Props: slides (DiapositivaResuelta[]), alturas ({ xs, sm, md, lg } CSS lengths), intervalo, etiqueta,
 * prioridad, ajuste, className?, id?.
 */
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import Icon from '@/components/Icon';
import IconoEspejo from './Iconos';
import './espejo-componentes.css';

export type DiapositivaResuelta = { src: string | null; w?: number; h?: number; alt: string; href?: string; externo?: boolean; original: string; boton?: { texto: string; href: string; externo: boolean } };

/** HTML layer of a slide: one of our lime buttons (the official layer is a button too). */
function BotonDiapositiva({ boton }: { boton: NonNullable<DiapositivaResuelta['boton']> }) {
  const clases = 'tc-btn tc-btn--lime tc-btn--sm wb-boton wb-boton--mayus wb-carrusel-boton';
  const contenido = <>{boton.texto}<Icon name="right" className="wb-boton-flecha"/></>;
  return boton.externo
    ? <a className={clases} href={boton.href} target="_blank" rel="noopener noreferrer">{contenido}<span className="tc-sr"> (se abre en otra pestaña)</span></a>
    : <Link className={clases} href={boton.href} prefetch={false}>{contenido}</Link>;
}
type Props = {
  slides: DiapositivaResuelta[];
  alturas: { xs: string; sm: string; md: string; lg: string };
  intervalo: number;
  etiqueta: string;
  prioridad: boolean;
  ajuste: 'cubrir' | 'contener';
  className?: string;
  id?: string;
};

const vecinos = (n: number, total: number) => [n, (n + 1) % total, (n - 1 + total) % total];

export default function CarruselCliente({ slides, alturas, intervalo, etiqueta, prioridad, ajuste, className = '', id }: Props) {
  const total = slides.length;
  const [actual, setActual] = useState(0);
  const [vistas, setVistas] = useState<ReadonlySet<number>>(() => new Set(total ? vecinos(0, total) : []));
  const [pausado, setPausado] = useState(false);
  const [encima, setEncima] = useState(false);
  const [foco, setFoco] = useState(false);
  const [movimiento, setMovimiento] = useState(false);
  const [oculto, setOculto] = useState(false);
  const toque = useRef<{ x: number; y: number } | null>(null);

  const ir = useCallback((n: number) => {
    if (!total) return;
    const destino = ((n % total) + total) % total;
    setActual(destino);
    setVistas(previas => vecinos(destino, total).every(i => previas.has(i)) ? previas : new Set([...previas, ...vecinos(destino, total)]));
  }, [total]);

  useEffect(() => {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)');
    const leer = () => setMovimiento(!reducido.matches && document.documentElement.dataset.tonyEffects !== 'off');
    const visibilidad = () => setOculto(document.hidden);
    leer(); visibilidad();
    reducido.addEventListener('change', leer);
    window.addEventListener('tony:effects-change', leer);
    document.addEventListener('visibilitychange', visibilidad);
    return () => {
      reducido.removeEventListener('change', leer);
      window.removeEventListener('tony:effects-change', leer);
      document.removeEventListener('visibilitychange', visibilidad);
    };
  }, []);

  const corriendo = total > 1 && movimiento && !pausado && !encima && !foco && !oculto;
  useEffect(() => {
    if (!corriendo) return;
    const espera = window.setTimeout(() => ir(actual + 1), Math.max(2500, intervalo));
    return () => window.clearTimeout(espera);
  }, [corriendo, actual, intervalo, ir]);

  if (!total) return null;
  const estilo = { '--wb-c-xs': alturas.xs, '--wb-c-sm': alturas.sm, '--wb-c-md': alturas.md, '--wb-c-lg': alturas.lg } as CSSProperties;

  return <section id={id} className={`wb-carrusel${ajuste === 'contener' ? ' wb-carrusel--contener' : ''} ${className}`.trim()} style={estilo}
    aria-roledescription="carrusel" aria-label={etiqueta} data-movimiento={movimiento || undefined}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setEncima(true); }}
    onPointerLeave={() => setEncima(false)}
    onFocus={() => setFoco(true)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFoco(false); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); ir(actual - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); ir(actual + 1); }
    }}>
    <div className="wb-carrusel-vista" aria-live={corriendo ? 'off' : 'polite'}
      onPointerDown={event => { if (event.pointerType !== 'mouse') toque.current = { x: event.clientX, y: event.clientY }; }}
      onPointerUp={event => {
        const inicio = toque.current;
        toque.current = null;
        if (!inicio) return;
        const dx = event.clientX - inicio.x, dy = event.clientY - inicio.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) ir(actual + (dx < 0 ? 1 : -1));
      }}
      onPointerCancel={() => { toque.current = null; }}>
      {slides.map((slide, i) => {
        const activa = i === actual;
        const media = !slide.src
          ? <span className="wb-img-falta" role="img" aria-label={slide.alt} data-falta-imagen={slide.original}/>
          : vistas.has(i)
            ? <img src={slide.src} width={slide.w} height={slide.h} alt={slide.alt} draggable={false} decoding="async"
                loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 && prioridad ? 'high' : undefined}/>
            : null;
        return <div key={i} className="wb-carrusel-diapo" data-activa={activa || undefined} role="group" aria-roledescription="diapositiva"
          aria-label={`${i + 1} de ${total}`} aria-hidden={!activa} inert={!activa}>
          {slide.href
            ? slide.externo
              ? <a className="wb-carrusel-enlace" href={slide.href} target="_blank" rel="noopener noreferrer">{media}</a>
              : <Link className="wb-carrusel-enlace" href={slide.href} prefetch={false}>{media}</Link>
            : media}
          {slide.boton && <BotonDiapositiva boton={slide.boton}/>}
        </div>;
      })}
    </div>
    {total > 1 && <>
      <button type="button" className="wb-carrusel-flecha wb-carrusel-flecha--prev" onClick={() => ir(actual - 1)} aria-label="Diapositiva anterior"><Icon name="left" size={22}/></button>
      <button type="button" className="wb-carrusel-flecha wb-carrusel-flecha--next" onClick={() => ir(actual + 1)} aria-label="Diapositiva siguiente"><Icon name="right" size={22}/></button>
      <div className="wb-carrusel-controles">
        {movimiento && <button type="button" className="wb-carrusel-pausa" onClick={() => setPausado(valor => !valor)} aria-label={pausado ? 'Reanudar el pase automático' : 'Pausar el pase automático'}>
          {pausado ? <Icon name="play" size={12}/> : <IconoEspejo nombre="pausa" size={12}/>}
        </button>}
        <ul className="wb-carrusel-puntos">
          {slides.map((_, i) => <li key={i}><button type="button" aria-label={`Ir a la diapositiva ${i + 1}`} aria-current={i === actual ? 'true' : undefined} onClick={() => ir(i)}/></li>)}
        </ul>
      </div>
    </>}
  </section>;
}
