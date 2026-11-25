'use client';
/*
 * ProveedorTienda: shares the shop's URL state (s, orderby, min_price, max_price, paged) with the results
 * and the sidebar widgets. The static page is prerendered without query; useSearchParams lives in its own
 * Suspense boundary (fallback null) so everything else stays in the static HTML.
 */
import { useSearchParams } from 'next/navigation';
import { createContext, Suspense, useContext, useEffect, useState, type ReactNode } from 'react';
import { leerParametros, PARAMETROS_VACIOS, type ParametrosTienda } from './tienda-comun';

const Contexto = createContext<ParametrosTienda>(PARAMETROS_VACIOS);

export function useParametrosTienda(): ParametrosTienda {
  return useContext(Contexto);
}

function LectorParametros({ alCambiar }: { alCambiar: (p: ParametrosTienda) => void }) {
  const consulta = useSearchParams().toString();
  useEffect(() => { alCambiar(leerParametros(new URLSearchParams(consulta))); }, [consulta, alCambiar]);
  return null;
}

export default function ProveedorTienda({ children }: { children: ReactNode }) {
  const [parametros, setParametros] = useState<ParametrosTienda>(PARAMETROS_VACIOS);
  return <Contexto.Provider value={parametros}>
    <Suspense fallback={null}><LectorParametros alCambiar={setParametros}/></Suspense>
    {children}
  </Contexto.Provider>;
}
