import type {Metadata} from 'next';

// Placeholder: keeps /producto alive for the protected cart (CartExperience links here) until the
// mirror of the official "Productos" page replaces this file.
export const metadata: Metadata = {title: 'Productos'};

export default function Producto() {
  return <main id="contenido" className="tc-page">
    <div className="tc-wrap">
      <header className="tc-head">
        <h1>Productos</h1>
      </header>
    </div>
  </main>;
}
