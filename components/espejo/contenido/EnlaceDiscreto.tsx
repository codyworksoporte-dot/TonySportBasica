/*
 * EnlaceDiscreto: an official link left empty (its picture was deleted from WordPress, e.g. on /replica/).
 * Mirrored as discreetly as the official: nothing shows with the mouse, but it keeps a name for screen readers
 * and becomes visible when it gets keyboard focus. Props: href (official URL, localised); children (name).
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { enlaceLocal, esExterno } from '@/lib/oficial/enlaces';
import './contenido.css';

type Props = { href: string; children: ReactNode };

export default function EnlaceDiscreto({ href, children }: Props) {
  const destino = enlaceLocal(href);
  if (esExterno(destino)) return <a className="wb-contenido-discreto" href={destino} target="_blank" rel="noopener noreferrer">{children}</a>;
  return <Link className="wb-contenido-discreto" href={destino} prefetch={false}>{children}</Link>;
}
