'use client';
/*
 * AvisoCerrable: the theme's closable warning box (warning_msg closable), as on the official 404 page:
 * the message and a × that hides it. Props: children (the message), tipo? ('error' default | 'info').
 */
import { useState, type ReactNode } from 'react';
import Icon from '@/components/Icon';
import './espejo-componentes.css';

export default function AvisoCerrable({ children, tipo = 'error' }: { children: ReactNode; tipo?: 'error' | 'info' }) {
  const [abierto, setAbierto] = useState(true);
  if (!abierto) return null;
  return <div className={`wb-aviso wb-aviso-cerrable${tipo === 'error' ? ' wb-aviso--error' : ''}`}>
    <p>{children}</p>
    <button type="button" className="wb-aviso-cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar aviso"><Icon name="close" size={16}/></button>
  </div>;
}
