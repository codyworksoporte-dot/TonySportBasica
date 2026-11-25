/*
 * UrlPartida: a URL written as link text (the official shows the bare addresses), with line-break hints after
 * each "/" and before "?", so phones wrap it at its separators instead of running off the screen. The CSS
 * overflow-wrap of the link still breaks a part that is longer than the line. Props: url.
 */
import { Fragment } from 'react';

export default function UrlPartida({ url }: { url: string }) {
  const partes = url.replace(/\/(?!\/)/g, '/\n').replace(/\?/g, '\n?').split('\n').filter(Boolean);
  return <>{partes.map((parte, i) => <Fragment key={i}>{i > 0 && <wbr/>}{parte}</Fragment>)}</>;
}
