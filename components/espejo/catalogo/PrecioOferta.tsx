/*
 * PrecioOferta: sale price as the official prints it, «$14.99 $13.99» (struck regular price, then the sale price).
 * The visible text stays the official one; screen readers get WooCommerce's own sentences after it.
 * Props: anterior (regular price), actual (sale price). Server and client safe.
 */
export default function PrecioOferta({ anterior, actual }: { anterior: string; actual: string }) {
  return <>
    <del aria-hidden="true">{anterior}</del> <ins aria-hidden="true">{actual}</ins>
    <span className="tc-sr">El precio original era: {anterior}. El precio actual es: {actual}.</span>
  </>;
}
