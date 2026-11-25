/*
 * Boton: our .tc-btn in place of the official theme buttons ("VER PRODUCTOS ›", "CONTÁCTANOS ›").
 * Props: children; href? (local "/..." uses next/link; http(s) opens in a new tab with rel noopener;
 * mailto:/tel:/# stay plain links; without href it renders a <button>); variante? 'lleno' (teal official
 * -> .tc-btn--lime, default) | 'contorno' (outline official -> .tc-btn--ghost); tamano? 'sm' | 'md' | 'lg'
 * (default 'md'); flecha? (trailing "›", default true); bloque? (full width); nuevaPestana? (force);
 * type? ('button' | 'submit' | 'reset', button only); onClick?; disabled? (button only); className?;
 * ariaLabel?; mayusculas? (official buttons are uppercase, default true).
 */
import Link from 'next/link';
import type { MouseEventHandler, ReactNode } from 'react';
import Icon from '@/components/Icon';
import './espejo-componentes.css';

export type BotonProps = {
  children: ReactNode;
  href?: string;
  variante?: 'lleno' | 'contorno';
  tamano?: 'sm' | 'md' | 'lg';
  flecha?: boolean;
  bloque?: boolean;
  nuevaPestana?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  mayusculas?: boolean;
};

export const esExterno = (href: string) => /^https?:\/\//i.test(href) || href.startsWith('//');

export default function Boton({ children, href, variante = 'lleno', tamano = 'md', flecha = true, bloque = false, nuevaPestana, type = 'button', onClick, disabled, className = '', ariaLabel, mayusculas = true }: BotonProps) {
  const clases = ['tc-btn', variante === 'lleno' ? 'tc-btn--lime' : 'tc-btn--ghost', tamano === 'sm' ? 'tc-btn--sm' : tamano === 'lg' ? 'tc-btn--lg' : '', bloque ? 'tc-btn--block' : '', 'wb-boton', mayusculas ? 'wb-boton--mayus' : '', className].filter(Boolean).join(' ');
  const contenido = <>{children}{flecha && <Icon name="right" className="wb-boton-flecha"/>}</>;
  if (!href) return <button type={type} className={clases} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>{contenido}</button>;
  const externo = esExterno(href);
  const nueva = nuevaPestana ?? externo;
  if (externo || !href.startsWith('/') || nueva) {
    return <a className={clases} href={href} onClick={onClick} aria-label={ariaLabel} {...(nueva ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {contenido}{nueva && <span className="tc-sr"> (se abre en otra pestaña)</span>}
    </a>;
  }
  return <Link className={clases} href={href} onClick={onClick} aria-label={ariaLabel} prefetch={false}>{contenido}</Link>;
}
