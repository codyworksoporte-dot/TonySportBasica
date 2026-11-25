/*
 * CajaImagen: the theme's image box (boc_image_box, "pic_info type1") in our skin: linked photo with the
 * corner "+" and, on hover or keyboard focus, a dark veil with the title. Like the official, the title is not
 * shown on touch screens. Without `imagen` it mirrors the official empty box: nothing visible, the link
 * appears only with keyboard focus.
 * Props: href (official URL, localised with enlaceLocal); titulo; imagen? (official image URL); nivel?
 * (2 | 3, heading level of the title, default 3); prioridad?.
 */
import Link from 'next/link';
import Icon from '@/components/Icon';
import ImagenOficial from '@/components/espejo/ImagenOficial';
import { enlaceLocal, esExterno } from '@/lib/oficial/enlaces';
import './contenido.css';

type Props = { href: string; titulo: string; imagen?: string; nivel?: 2 | 3; prioridad?: boolean };

export default function CajaImagen({ href, titulo, imagen, nivel = 3, prioridad = false }: Props) {
  const destino = enlaceLocal(href);
  const Encabezado = `h${nivel}` as 'h3';
  const contenido = <>
    {imagen && <>
      <ImagenOficial url={imagen} alt="" className="wb-contenido-img" prioridad={prioridad}/>
      <span className="wb-contenido-caja-esquina" aria-hidden="true"><Icon name="plus" size={22}/></span>
    </>}
    <div className="wb-contenido-caja-info">
      <span className="wb-contenido-caja-icono" aria-hidden="true"><Icon name="diagonal" size={20}/></span>
      <Encabezado className="wb-contenido-caja-titulo">{titulo}</Encabezado>
    </div>
  </>;
  const clases = `wb-contenido-caja${imagen ? '' : ' wb-contenido-caja--vacia'}`;
  const enlace = esExterno(destino)
    ? <a className={clases} href={destino} target="_blank" rel="noopener noreferrer">{contenido}</a>
    : <Link className={clases} href={destino} prefetch={false}>{contenido}</Link>;
  // The empty official box still takes its element margin (35 px) in the column.
  return imagen ? enlace : <div className="wb-contenido-caja-hueco">{enlace}</div>;
}
