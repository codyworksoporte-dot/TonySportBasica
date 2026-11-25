/*
 * VideoNoticia: one Tony News row (vc_row): the centred title, then the WordPress video (portrait 478 x 850,
 * at the left of the row on desktop, full width on phones) with the browser's own controls.
 * The official .mp4 files were not mirrored: a copy saved as public/assets/oficial/video/<file name>.mp4 is
 * used when it exists at build time; otherwise the video streams from the official address.
 * Props: titulo; video (official .mp4 URL); negrita? (the official bolds some titles); id (title id).
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { siteAsset } from '@/lib/asset-path';
import './contenido.css';

type Props = { titulo: string; video: string; negrita?: boolean; id: string };

function fuenteVideo(url: string): string {
  const limpia = url.replace(/[?#].*$/, '');
  let archivo = limpia.split('/').pop() ?? '';
  try { archivo = decodeURIComponent(archivo); } catch { /* keep the raw name */ }
  if (/^[\w.,() -]+\.mp4$/i.test(archivo) && existsSync(join(process.cwd(), 'public', 'assets', 'oficial', 'video', archivo))) {
    return siteAsset(`/assets/oficial/video/${encodeURIComponent(archivo)}`);
  }
  return limpia;
}

export default function VideoNoticia({ titulo, video, negrita = false, id }: Props) {
  const src = fuenteVideo(video);
  return <section className="wb-contenido-video" aria-labelledby={id}>
    <div className="wb-contenedor">
      <h2 id={id} className={`wb-contenido-video-titulo${negrita ? ' wb-contenido-video-titulo--negrita' : ''}`}>{titulo}</h2>
      <div className="wb-contenido-video-marco">
        {/* #t=0.001 makes Safari paint the first frame, as the official player shows it. */}
        <video className="wb-contenido-video-medio" src={`${src}#t=0.001`} width={478} height={850} controls preload="metadata" playsInline aria-label={titulo}>
          <a href={src}>{src}</a>
        </video>
      </div>
    </div>
  </section>;
}
