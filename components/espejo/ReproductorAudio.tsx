'use client';
/*
 * ReproductorAudio: the footer audio bar of the official site (MediaElement player: play, time, rail,
 * duration, mute, volume) in our colours. Native range inputs keep it usable with the keyboard.
 * Props: src (local file, already through siteAsset); tipo? (MIME, e.g. 'audio/wav'); duracion? ("01:15",
 * shown until the file's metadata arrives, like the official); etiqueta? (accessible name).
 */
import { useRef, useState, type CSSProperties } from 'react';
import Icon from '@/components/Icon';
import IconoEspejo from './Iconos';

type Props = { src: string; tipo?: string; duracion?: string; etiqueta?: string };

const reloj = (segundos: number) => {
  if (!Number.isFinite(segundos) || segundos < 0) return '00:00';
  const total = Math.floor(segundos);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export default function ReproductorAudio({ src, tipo, duracion: duracionInicial, etiqueta = 'Reproductor de audio' }: Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const [sonando, setSonando] = useState(false);
  const [actual, setActual] = useState(0);
  const [duracion, setDuracion] = useState(0);
  const [silencio, setSilencio] = useState(false);
  const [volumen, setVolumen] = useState(.8);
  const [fallo, setFallo] = useState(false);

  const alternar = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setFallo(true)); else el.pause();
  };
  const progreso = duracion ? Math.min(100, (actual / duracion) * 100) : 0;
  const nivel = silencio ? 0 : volumen;

  return <div className="wb-audio" role="group" aria-label={etiqueta} data-fallo={fallo || undefined}>
    <audio ref={audio} preload="metadata"
      onPlay={() => setSonando(true)} onPause={() => setSonando(false)} onEnded={() => { setSonando(false); setActual(0); }}
      onTimeUpdate={event => setActual(event.currentTarget.currentTime)}
      onLoadedMetadata={event => { setDuracion(event.currentTarget.duration); event.currentTarget.volume = volumen; }}
      onVolumeChange={event => { setSilencio(event.currentTarget.muted); setVolumen(event.currentTarget.volume); }}
      onError={() => setFallo(true)}>
      <source src={src} type={tipo} onError={() => setFallo(true)}/>
    </audio>
    <button type="button" className="wb-audio-boton" onClick={alternar} aria-label={sonando ? 'Pausar' : 'Reproducir'} title={sonando ? 'Pausar' : 'Reproducir'}>
      {sonando ? <IconoEspejo nombre="pausa" size={16}/> : <Icon name="play" size={16}/>}
    </button>
    <span className="wb-audio-tiempo" aria-hidden="true">{reloj(actual)}</span>
    <input type="range" className="wb-audio-rango wb-audio-rango--tiempo" min={0} max={duracion || 0} step={0.1} value={Math.min(actual, duracion || 0)}
      style={{ '--p': `${progreso}%` } as CSSProperties} aria-label="Control de tiempo" aria-valuetext={`${reloj(actual)} de ${reloj(duracion)}`}
      disabled={!duracion}
      onChange={event => { const el = audio.current; if (el) { el.currentTime = Number(event.target.value); setActual(el.currentTime); } }}/>
    <span className="wb-audio-tiempo" aria-hidden="true">{duracion ? reloj(duracion) : duracionInicial ?? reloj(0)}</span>
    <button type="button" className="wb-audio-boton" onClick={() => { const el = audio.current; if (el) el.muted = !el.muted; }} aria-label={silencio ? 'Activar sonido' : 'Silenciar'} title={silencio ? 'Activar sonido' : 'Silenciar'}>
      <IconoEspejo nombre={silencio ? 'silencio' : 'volumen'} size={18}/>
    </button>
    <input type="range" className="wb-audio-rango wb-audio-rango--volumen" min={0} max={1} step={0.05} value={nivel}
      style={{ '--p': `${nivel * 100}%` } as CSSProperties} aria-label="Control de volumen" aria-valuetext={`${Math.round(nivel * 100)}%`}
      aria-describedby="wb-audio-ayuda-volumen"
      onChange={event => { const el = audio.current; if (!el) return; el.volume = Number(event.target.value); el.muted = el.volume === 0; }}/>
    {/* Same screen-reader hint as the official MediaElement player. */}
    <span id="wb-audio-ayuda-volumen" className="tc-sr">Utiliza las teclas de flecha arriba/abajo para aumentar o disminuir el volumen.</span>
  </div>;
}
