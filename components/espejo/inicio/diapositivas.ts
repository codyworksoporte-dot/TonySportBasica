/*
 * The official home slider (Slider Revolution «portada»): its 19 slides in the official order, with their
 * official image URLs. Every slide is one picture; the only HTML layer is the «Mas diseños» button of the
 * third slide, which opens its category: here the whole slide links there and inicio.css draws the button.
 */
import type { Diapositiva } from '@/components/espejo/Carrusel';
import { enlaceLocal } from '@/lib/oficial/enlaces';

const SUBIDAS = 'https://www.tonysportselsalvador.com/wp-content/uploads/';

export const ENLACE_MAS_DISENOS = enlaceLocal('https://www.tonysportselsalvador.com/categoria/camisa-full-sublimada-y-calzoneta-full-sublimada-personalizados/');

export const DIAPOSITIVAS: Diapositiva[] = [
  { imagen: `${SUBIDAS}c279addb-9ccd-4580-bc2e-5518ae58d98f.jpeg`, alt: 'Tony Sportswear conquistando Primera: patrocinador oficial de C.D. Cacahuatique, C.D. Municipal Limeño, C.D. Fuerte San Francisco y C.D. Platense' },
  { imagen: `${SUBIDAS}WhatsApp-Image-2024-09-30-at-6.08.44-PM-1.jpeg`, alt: 'En Tony Sportswear te ofrecemos nuestras líneas de telas: Slim Fit, Slim Pro, Modern Carvin, Premier, Dry Fit y Dry Cool' },
  { imagen: `${SUBIDAS}Full-sublimados-portada-1.png`, alt: '¡Tu diseño, tu estilo! Uniformes full sublimados: Mas diseños', href: ENLACE_MAS_DISENOS },
  { imagen: `${SUBIDAS}photo_5087243150292005205_y.jpg`, alt: 'Descarga nuestra App y acumula puntos' },
  { imagen: `${SUBIDAS}WhatsApp-Image-2024-09-26-at-9.09.24-AM-3.jpeg`, alt: 'Tony Sportswear x Pollo Campero: ¡acumula puntos y gana!' },
  { imagen: `${SUBIDAS}e8d7fbea-cfb7-45aa-b708-a9c1bbcad5cf.jpeg`, alt: 'Camisas de algodón con tu logo a color a tan solo $4.99' },
  { imagen: `${SUBIDAS}photo_5087237545359683139_y.jpg`, alt: 'Compra en línea implementos deportivos y diseños de fútbol: si no lo tenemos, te lo hacemos' },
  { imagen: `${SUBIDAS}photo_5087237545359683137_y.jpg`, alt: 'Línea voleibol' },
  { imagen: `${SUBIDAS}photo_5087237545359683135_y.jpg`, alt: 'Por tus compras llévate una gorra gratis' },
  { imagen: `${SUBIDAS}Hoodies-sublimados.png`, alt: 'Hoodies sublimados: tu estilo, tu diseño' },
  { imagen: `${SUBIDAS}photo_4936040935465266520_w.jpg`, alt: 'Implementos deportivos' },
  { imagen: `${SUBIDAS}photo_4936040935465266522_w-1.jpg`, alt: 'Jerseys de fútbol' },
  { imagen: `${SUBIDAS}WhatsApp-Image-2024-09-30-at-6.08.44-PM-2-1.jpeg`, alt: 'Línea racing' },
  { imagen: `${SUBIDAS}WhatsApp-Image-2024-09-30-at-6.08.44-PM-3-1.jpeg`, alt: 'Línea racing de manga larga' },
  { imagen: `${SUBIDAS}2cf8d49b-75a2-4a04-83c0-d3072eb29ca2.jpeg`, alt: 'Línea basketball' },
  { imagen: `${SUBIDAS}7594bc81-9e5d-491b-9933-7e26f5f643a5.jpeg`, alt: 'Línea runner' },
  { imagen: `${SUBIDAS}WhatsApp-Image-2024-09-30-at-6.08.44-PM-4.jpeg`, alt: 'Línea empresarial' },
  { imagen: `${SUBIDAS}12c56f16-a81a-4665-a7cd-24ea1b23fecb.jpeg`, alt: 'Don’t hold back: Cycling Pro 2025' },
  { imagen: `${SUBIDAS}WhatsApp-Image-2025-11-24-at-12.21.03-PM.jpeg`, alt: 'Cycling Pro: tecnología, velocidad y estilo' },
];
