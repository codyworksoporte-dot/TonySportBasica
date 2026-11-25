import { indiceTienda } from '@/components/espejo/tienda/datos-tienda';

// Static JSON of the whole catalogue (written at build time as /productos/indice.json). The shop loads it
// only for search, price filter and order, like the official ?s= / ?min_price= / ?orderby= reloads.
export const dynamic = 'force-static';

export function GET() {
  return Response.json({ productos: indiceTienda() });
}
