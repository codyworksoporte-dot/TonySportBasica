/*
 * VideoEmbed: YouTube or Facebook video iframe, loaded lazily, responsive (16:9 by default).
 * Accepts watch/share/embed/shorts YouTube URLs (played from youtube-nocookie.com) and Facebook video
 * URLs (plugins/video.php); any other URL is used as the iframe src.
 * Props: url; titulo (accessible title); proporcion? (CSS aspect-ratio, default '16 / 9'); className?.
 * urlEmbebida(url) is exported for pages that need the embed URL itself.
 */
import './espejo-componentes.css';

type Props = { url: string; titulo: string; proporcion?: string; className?: string };

export function urlEmbebida(url: string): string {
  const limpia = url.trim().replace(/&amp;/g, '&');
  const youtube = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/i.exec(limpia);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  if (/facebook\.com\/plugins\/video\.php/i.test(limpia)) return limpia;
  if (/(?:facebook\.com|fb\.watch)\//i.test(limpia)) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(limpia)}&show_text=false`;
  return limpia;
}

export default function VideoEmbed({ url, titulo, proporcion = '16 / 9', className = '' }: Props) {
  return <div className={`wb-video ${className}`.trim()} style={{ aspectRatio: proporcion }}>
    <iframe src={urlEmbebida(url)} title={titulo} loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
  </div>;
}
