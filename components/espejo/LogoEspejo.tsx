/*
 * LogoEspejo: our 2026 logo where the official header shows the old one (box 170×146, 72×62 on phones).
 * Like the official logo it is a plain link to the home page. No props.
 */
import Link from 'next/link';
import { siteAsset } from '@/lib/asset-path';

export default function LogoEspejo() {
  const pequeno = siteAsset('/assets/brand/tony-logo-480.webp');
  const grande = siteAsset('/assets/brand/tony-logo.webp');
  return <Link href="/" className="brand wb-logo" rel="home" title="TONY SPORTSWEAR EL SALVADOR">
    <img className="wb-logo-img" src={pequeno} srcSet={`${pequeno} 480w, ${grande} 1200w`} sizes="(max-width: 1018px) 70px, 163px" width={480} height={432} alt="TONY SPORTSWEAR EL SALVADOR" fetchPriority="high" decoding="async"/>
  </Link>;
}
