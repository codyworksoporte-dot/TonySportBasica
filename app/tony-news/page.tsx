import type { Metadata } from 'next';
import VideoNoticia from '@/components/espejo/contenido/VideoNoticia';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/tony-news/: seven rows, each a centred title and its video.
export const metadata: Metadata = { title: 'Tony News' };

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

// Titles as published (the official bolds some of them); videos in the official order.
const VIDEOS = [
  { titulo: 'LINEA MOTORCYCLE', video: `${SUBIDAS}Video-de-WhatsApp-2025-12-04-a-las-13.44.10_a296132f.mp4`, negrita: true },
  { titulo: 'CYCLING PRO', video: `${SUBIDAS}Video-de-WhatsApp-2025-12-04-a-las-13.59.44_2f0f2246.mp4`, negrita: true },
  { titulo: 'MOLDE DE FÙTBOL', video: `${SUBIDAS}Video-de-WhatsApp-2025-12-04-a-las-14.18.31_2c479fe6.mp4`, negrita: true },
  { titulo: 'TONY PREMIA TUS COMPRAS', video: `${SUBIDAS}WhatsApp-Video-2025-12-23-at-8.17.19-AM.mp4`, negrita: false },
  { titulo: 'COSTURA REFORZADA', video: `${SUBIDAS}WhatsApp-Video-2025-12-23-at-8.17.31-AM.mp4`, negrita: false },
  { titulo: 'DISEÑOS NUEVOS MUNDIAL 2026', video: `${SUBIDAS}WhatsApp-Video-2025-12-31-at-10.30.15-AM.mp4`, negrita: true },
  { titulo: 'RÉPLICAS SUBLIMADAS A SOLO $8.49', video: `${SUBIDAS}WhatsApp-Video-2026-01-19-at-9.14.19-AM.mp4`, negrita: false },
];

export default function TonyNewsPage() {
  return <main id="contenido" className="wb-contenido-pagina">
    {/* The official page title (h1 "Tony News") is hidden by the theme. */}
    <h1 className="sr-only">Tony News</h1>
    {VIDEOS.map((v, i) => <VideoNoticia key={v.video} id={`tony-news-${i + 1}`} titulo={v.titulo} video={v.video} negrita={v.negrita}/>)}
  </main>;
}
