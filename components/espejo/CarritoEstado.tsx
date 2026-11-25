'use client';
/*
 * Cart state shared by the header counter and the floating cart, read once per page load.
 * The cart holds our saved designs: the legacy studio cart (lib/cart, counted without reading artwork)
 * plus the "Crea tu pedido" drafts (lib/pedido/storage). Wrap the chrome in <ProveedorCarritoEspejo>.
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useCartCount } from '@/lib/cart';
import { usePedidoCart } from '@/lib/pedido/storage';
import type { PedidoDraft } from '@/lib/pedido/types';

export type EstadoCarrito = {
  /** Designs in both carts. */
  total: number;
  /** Items of the legacy studio cart (lib/cart). */
  disenos: number;
  /** "Crea tu pedido" drafts, complete (they carry their preview images). */
  pedidos: PedidoDraft[];
  cargando: boolean;
  error: string;
};

const VACIO: EstadoCarrito = { total: 0, disenos: 0, pedidos: [], cargando: true, error: '' };
const Contexto = createContext<EstadoCarrito>(VACIO);

export function ProveedorCarritoEspejo({ children }: { children: ReactNode }) {
  const legado = useCartCount();
  const pedido = usePedidoCart();
  const valor = useMemo<EstadoCarrito>(() => ({
    total: legado.count + pedido.items.length,
    disenos: legado.count,
    pedidos: pedido.items,
    cargando: legado.loading || pedido.loading,
    error: legado.error || pedido.error,
  }), [legado.count, legado.loading, legado.error, pedido.items, pedido.loading, pedido.error]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarritoEspejo(): EstadoCarrito {
  return useContext(Contexto);
}
