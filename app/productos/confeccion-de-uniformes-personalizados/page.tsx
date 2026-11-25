import type { Metadata } from 'next';
import ConfeccionDeUniformesPage from '../../confeccion-de-uniformes-personalizados/page';

// The official page lives at /productos/confeccion-de-uniformes-personalizados/ (a child of "Productos");
// the mirror serves the same page at that URL and at /confeccion-de-uniformes-personalizados/.
export const metadata: Metadata = { title: 'Confección de uniformes personalizados' };

export default ConfeccionDeUniformesPage;
