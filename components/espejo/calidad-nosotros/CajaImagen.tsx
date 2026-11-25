/*
 * CajaImagen: the theme's image box with hover caption (boc_image_box, pic_info type1) as used on
 * Nuestra Calidad: a 600x380 picture linking to a product, a lime corner "+" and, on hover or keyboard focus,
 * a dark veil with the title. The title stays in the link for screen readers and touch.
 * Props: href (local route), titulo, urls (official URLs: the 600x380 crop first, then the full file),
 * nivel? (heading level of the title, default 3).
 */
import Link from 'next/link';
import Icon from '@/components/Icon';
import ImagenAdaptable from './ImagenAdaptable';
import './calidad-nosotros.css';

type Props = { href: string; titulo: string; urls: string[]; nivel?: 2 | 3 | 4 };

export default function CajaImagen({ href, titulo, urls, nivel = 3 }: Props) {
  const Encabezado = `h${nivel}` as 'h3';
  return <Link href={href} className="wb-calidad-nosotros-caja" prefetch={false}>
    <ImagenAdaptable urls={urls} alt="" ancho={600} alto={380} sizes="(max-width: 767px) calc(100vw - 90px), (max-width: 1199px) 45vw, 585px"/>
    <div className="wb-calidad-nosotros-caja-velo" aria-hidden="true"/>
    <div className="wb-calidad-nosotros-caja-info">
      <span className="wb-calidad-nosotros-caja-icono" aria-hidden="true"><Icon name="diagonal" size={20}/></span>
      <Encabezado className="wb-calidad-nosotros-caja-titulo">{titulo}</Encabezado>
    </div>
    <span className="wb-calidad-nosotros-caja-mas" aria-hidden="true"><Icon name="plus" size={16}/></span>
  </Link>;
}
