'use client';
/*
 * PreferenciaEfectos: keeps html[data-tony-effects] ('on' | 'off') like the redesign's AmbientExperience did
 * (which the mirror no longer mounts: its corner toggle and peeking crocodile would sit over the official
 * widgets). It honours prefers-reduced-motion and a stored "pause effects" choice, so the configurator,
 * cart and route transition keep reading the same signal. Renders nothing. No props.
 */
import { useEffect } from 'react';
import { AMBIENT } from '@/lib/ambient-config';

export default function PreferenciaEfectos() {
  useEffect(() => {
    const reducido = matchMedia('(prefers-reduced-motion: reduce)');
    const aplicar = () => {
      let elegido = true;
      try { elegido = localStorage.getItem(AMBIENT.preferenceKey) !== 'off'; } catch { /* Storage may be blocked. */ }
      const valor = elegido && !reducido.matches ? 'on' : 'off';
      if (document.documentElement.dataset.tonyEffects === valor) return;
      document.documentElement.dataset.tonyEffects = valor;
      window.dispatchEvent(new CustomEvent('tony:effects-change', { detail: { enabled: valor === 'on' } }));
    };
    const alGuardar = (event: StorageEvent) => { if (event.key === AMBIENT.preferenceKey) aplicar(); };
    aplicar();
    reducido.addEventListener('change', aplicar);
    window.addEventListener('storage', alGuardar);
    return () => { reducido.removeEventListener('change', aplicar); window.removeEventListener('storage', alGuardar); };
  }, []);
  return null;
}
