'use client';
/*
 * CarruselTestimonios: the theme's big testimonial carousel (Owl: one item, slides in 600 ms, autoplay every
 * 6 s, arrows without wrap, no dots). Use Testimonios (server) so photos are resolved before reaching the browser.
 * Accessible: region with slide labels, arrow keys, swipe, pauses on hover, on focus, while the tab is hidden
 * and with its pause button; no autoplay or sliding with prefers-reduced-motion or html[data-tony-effects=off].
 * Props: testimonios (TestimonioResuelto[]), intervalo (ms), etiqueta (accessible name).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import IconoEspejo from '@/components/espejo/Iconos';
import './calidad-nosotros.css';

export type TestimonioResuelto = { texto: string; nombre: string; lugar: string; foto: { src: string; w: number; h: number } | null; original: string };
type Props = { testimonios: TestimonioResuelto[]; intervalo: number; etiqueta: string };

export default function CarruselTestimonios({ testimonios, intervalo, etiqueta }: Props) {
  const total = testimonios.length;
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [encima, setEncima] = useState(false);
  const [foco, setFoco] = useState(false);
  const [movimiento, setMovimiento] = useState(false);
  const [oculto, setOculto] = useState(false);
  const toque = useRef<{ x: number; y: number } | null>(null);

  // Arrows stop at both ends, like the official (navRewind: false).
  const ir = useCallback((n: number) => setActual(Math.max(0, Math.min(total - 1, n))), [total]);

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

  // Autoplay goes back to the first testimonial after the last one.
  const corriendo = total > 1 && movimiento && !pausado && !encima && !foco && !oculto;
  useEffect(() => {
    if (!corriendo) return;
    const espera = window.setTimeout(() => setActual(n => (n + 1) % total), Math.max(2500, intervalo));
    return () => window.clearTimeout(espera);
  }, [corriendo, actual, intervalo, total]);

  if (!total) return null;
  return <section className="wb-calidad-nosotros-testimonios" aria-roledescription="carrusel" aria-label={etiqueta} data-movimiento={movimiento || undefined}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setEncima(true); }}
    onPointerLeave={() => setEncima(false)}
    onFocus={() => setFoco(true)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFoco(false); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); ir(actual - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); ir(actual + 1); }
    }}>
    <div className="wb-calidad-nosotros-testimonios-vista" aria-live={corriendo ? 'off' : 'polite'}
      onPointerDown={event => { if (event.pointerType !== 'mouse') toque.current = { x: event.clientX, y: event.clientY }; }}
      onPointerUp={event => {
        const inicio = toque.current;
        toque.current = null;
        if (!inicio) return;
        const dx = event.clientX - inicio.x, dy = event.clientY - inicio.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) ir(actual + (dx < 0 ? 1 : -1));
      }}
      onPointerCancel={() => { toque.current = null; }}>
      <div className="wb-calidad-nosotros-testimonios-pista" style={{ transform: `translateX(${-100 * actual}%)` }}>
        {testimonios.map((testimonio, i) => <div key={testimonio.nombre} className="wb-calidad-nosotros-testimonio" role="group" aria-roledescription="diapositiva"
          aria-label={`${i + 1} de ${total}`} aria-hidden={i !== actual} inert={i !== actual}>
          <figure className="wb-calidad-nosotros-testimonio-figura">
            <blockquote className="wb-calidad-nosotros-testimonio-cita"><p>{testimonio.texto}</p></blockquote>
            <figcaption className="wb-calidad-nosotros-testimonio-autor">
              {testimonio.foto
                ? <img className="wb-calidad-nosotros-testimonio-foto" src={testimonio.foto.src} width={testimonio.foto.w} height={testimonio.foto.h} alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async"/>
                : <span className="wb-img-falta wb-calidad-nosotros-testimonio-foto" aria-hidden="true" data-falta-imagen={testimonio.original}/>}
              <span className="wb-calidad-nosotros-testimonio-nombre">{testimonio.nombre}</span>
              <span className="wb-calidad-nosotros-testimonio-lugar">{testimonio.lugar}</span>
            </figcaption>
          </figure>
        </div>)}
      </div>
    </div>
    {total > 1 && <>
      <button type="button" className="wb-calidad-nosotros-testimonios-flecha wb-calidad-nosotros-testimonios-flecha--prev" aria-label="Testimonio anterior"
        aria-disabled={actual === 0} onClick={() => ir(actual - 1)}><Icon name="left" size={22}/></button>
      <button type="button" className="wb-calidad-nosotros-testimonios-flecha wb-calidad-nosotros-testimonios-flecha--next" aria-label="Testimonio siguiente"
        aria-disabled={actual === total - 1} onClick={() => ir(actual + 1)}><Icon name="right" size={22}/></button>
      {movimiento && <button type="button" className="wb-calidad-nosotros-testimonios-pausa" onClick={() => setPausado(valor => !valor)}
        aria-label={pausado ? 'Reanudar el pase automático' : 'Pausar el pase automático'}>
        {pausado ? <Icon name="play" size={12}/> : <IconoEspejo nombre="pausa" size={12}/>}
      </button>}
    </>}
  </section>;
}
