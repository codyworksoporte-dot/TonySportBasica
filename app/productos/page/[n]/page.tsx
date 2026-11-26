import type { Metadata } from 'next';
import ArchivoTienda from '@/components/espejo/tienda/ArchivoTienda';
import { paginasDeTienda } from '@/lib/oficial/catalogo';

// Shop archive pages 2–21 (/productos/page/<n>/); page 1 is /productos/.
export const dynamicParams = false;

export function generateStaticParams(): { n: string }[] {
  return paginasDeTienda().filter((p) => p.pagina > 1).map((p) => ({ n: String(p.pagina) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  // Official tab: "Productos | TONY SPORTSWEAR EL SALVADOR | Page N" (page number after the site name).
  return { title: { absolute: `Productos | TONY SPORTSWEAR EL SALVADOR | Page ${Number(n)}` } };
}

export default async function ProductosPagina({ params }: Props) {
  const { n } = await params;
  return <ArchivoTienda pagina={Number(n)}/>;
}
