'use client';
/*
 * LogoEspejo: our 2026 logo where the official header shows the old one (box 170×146, 72×62 on phones).
 * On desktop a click replays the crocodile intro before going home, like the redesign's Brand. No props.
 */
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { flushSync } from 'react-dom';
import { siteAsset } from '@/lib/asset-path';

export default function LogoEspejo() {
  const router = useRouter();
  const pequeno = siteAsset('/assets/brand/tony-logo-480.webp');
  const grande = siteAsset('/assets/brand/tony-logo.webp');
  return <Link href="/" className="brand wb-logo" rel="home" title="TONY SPORTSWEAR EL SALVADOR" onClick={event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (matchMedia('(max-width: 900px), (pointer: coarse)').matches) return;
    event.preventDefault();
    // Mount the intro before changing routes, so the page never flashes first.
    flushSync(() => window.dispatchEvent(new Event('tony:intro-replay')));
    router.push('/');
    const base = process.env.TONY_ASSET_BASE || '';
    if (['/', base, `${base}/`].includes(window.location.pathname)) window.scrollTo({ top: 0, behavior: 'instant' });
  }}>
    <img className="wb-logo-img" src={pequeno} srcSet={`${pequeno} 480w, ${grande} 1200w`} sizes="(max-width: 1018px) 70px, 163px" width={480} height={432} alt="TONY SPORTSWEAR EL SALVADOR" fetchPriority="high" decoding="async"/>
  </Link>;
}
