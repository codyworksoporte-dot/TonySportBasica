/*
 * MapaEmbed: Google Maps iframe of the official store pages, loaded lazily (loading="lazy"), framed in our
 * colours. Props: src (Google Maps embed URL, as in the official iframe); titulo (accessible title, e.g.
 * "Mapa de Tony Sportswear San Salvador"); alto? (px or CSS length, default 320 like the official
 * .mapasuc iframe); className?.
 */
import './espejo-componentes.css';

type Props = { src: string; titulo: string; alto?: number | string; className?: string };

export default function MapaEmbed({ src, titulo, alto = 320, className = '' }: Props) {
  return <div className={`wb-mapa ${className}`.trim()} style={{ height: typeof alto === 'number' ? `${alto}px` : alto }}>
    <iframe src={src} title={titulo} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
  </div>;
}
