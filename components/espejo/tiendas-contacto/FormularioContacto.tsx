'use client';
/*
 * FormularioContacto: the official Contact Form 7 of /contacto/ (same fields, placeholders and order:
 * Nombre*, Correo electrónico*, Cel/WhatsApp, Mensaje*, the "¿Cuánto es 5 + 3?" quiz and «Enviar Mensaje»).
 * Like CF7 (novalidate) it checks the fields on submit: each wrong field gets its message right under it
 * (aria-invalid + aria-describedby), focus moves to the first one and the response box under the button sums
 * it up (live region). A message clears as soon as its field is fixed. The official form posts to WordPress;
 * this one opens WhatsApp (wa.me/50370155571) with the message built from the fields, and says so next to the
 * button. No props.
 */
import { useId, useState, type FormEvent } from 'react';
import Boton from '@/components/espejo/Boton';
import './tiendas-contacto.css';

const WHATSAPP = 'https://wa.me/50370155571';
const OBLIGATORIO = 'El campo es obligatorio.';
const CORREO_INVALIDO = 'La dirección de correo electrónico no es válida.';
const QUIZ_ERROR = 'La respuesta al cuestionario no es correcta.';
const RESUMEN_ERROR = 'Uno o más campos tienen un error. Por favor, revísalos e inténtalo de nuevo.';
const ENVIADO = 'Abrimos WhatsApp con tu mensaje.';
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Campo = 'nombre' | 'email' | 'telefono' | 'mensaje' | 'capital-quiz';
type Errores = Partial<Record<Campo, string>>;
const ORDEN: Campo[] = ['nombre', 'email', 'telefono', 'mensaje', 'capital-quiz'];

/** CF7's rules for this form: required fields, a valid e-mail and the quiz answer (8). */
function revisarCampo(campo: Campo, valor: string): string | undefined {
  if (campo === 'telefono') return undefined;
  if (!valor) return OBLIGATORIO;
  if (campo === 'email' && !CORREO.test(valor)) return CORREO_INVALIDO;
  if (campo === 'capital-quiz' && valor !== '8') return QUIZ_ERROR;
  return undefined;
}

/** Opens the chat in a new tab from the submit gesture (an anchor keeps noopener without returning a handle). */
function abrirWhatsApp(texto: string) {
  const enlace = document.createElement('a');
  enlace.href = `${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  enlace.target = '_blank';
  enlace.rel = 'noopener noreferrer';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
}

export default function FormularioContacto() {
  const id = useId();
  const [errores, setErrores] = useState<Errores>({});
  const [respuesta, setRespuesta] = useState<{ texto: string; error: boolean } | null>(null);

  const idCampo = (campo: Campo) => `${id}-${campo}`;
  // Props shared by every field: name, id and the error wiring (aria-invalid + aria-describedby).
  const enlazar = (campo: Campo) => ({
    id: idCampo(campo),
    name: campo,
    'aria-invalid': errores[campo] ? true : undefined,
    'aria-describedby': errores[campo] ? `${idCampo(campo)}-error` : undefined,
  });
  const aviso = (campo: Campo) => errores[campo]
    ? <span id={`${idCampo(campo)}-error`} className="wb-tiendas-contacto-error">{errores[campo]}</span>
    : null;

  // Once a field shows an error, it is checked again while the person fixes it.
  const corregir = (evento: FormEvent<HTMLFormElement>) => {
    const campo = (evento.target as HTMLInputElement).name as Campo;
    if (!errores[campo]) return;
    const error = revisarCampo(campo, (evento.target as HTMLInputElement).value.trim());
    if (!error) setErrores(previos => { const siguientes = { ...previos }; delete siguientes[campo]; return siguientes; });
  };

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const valor = (campo: Campo) => String(datos.get(campo) ?? '').trim();
    const nuevos: Errores = {};
    for (const campo of ORDEN) { const error = revisarCampo(campo, valor(campo)); if (error) nuevos[campo] = error; }
    setErrores(nuevos);
    const primero = ORDEN.find(campo => nuevos[campo]);
    if (primero) {
      setRespuesta({ texto: RESUMEN_ERROR, error: true });
      (formulario.elements.namedItem(primero) as HTMLElement | null)?.focus();
      return;
    }
    const texto = [
      `Nombre: ${valor('nombre')}`,
      `Correo electrónico: ${valor('email')}`,
      valor('telefono') ? `Cel/WhatsApp: ${valor('telefono')}` : '',
      `Mensaje: ${valor('mensaje')}`,
    ].filter(Boolean).join('\n');
    abrirWhatsApp(texto);
    setRespuesta({ texto: ENVIADO, error: false });
  };

  return <form className="wb-form wb-tiendas-contacto-form" noValidate onSubmit={enviar} onInput={corregir} aria-describedby={`${id}-nota`}>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={idCampo('nombre')}>Nombre (obligatorio)</label>
      <input {...enlazar('nombre')} type="text" placeholder="Nombre*" autoComplete="name" required/>
      {aviso('nombre')}
    </p>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={idCampo('email')}>Correo electrónico (obligatorio)</label>
      <input {...enlazar('email')} type="email" placeholder="Correo electrónico*" autoComplete="email" required/>
      {aviso('email')}
    </p>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={idCampo('telefono')}>Cel/WhatsApp</label>
      <input {...enlazar('telefono')} type="tel" placeholder="Cel/WhatsApp" autoComplete="tel" inputMode="tel"/>
    </p>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={idCampo('mensaje')}>Mensaje (obligatorio)</label>
      <textarea {...enlazar('mensaje')} placeholder="Mensaje*" rows={5} required/>
      {aviso('mensaje')}
    </p>
    <p className="wb-campo">
      <label className="wb-etiqueta" htmlFor={idCampo('capital-quiz')}>¿Cuánto es 5 + 3?</label>
      <input {...enlazar('capital-quiz')} type="text" inputMode="numeric" autoComplete="off" required/>
      {aviso('capital-quiz')}
    </p>
    <div className="wb-tiendas-contacto-envio">
      <Boton type="submit" tamano="sm">Enviar Mensaje</Boton>
      <p id={`${id}-nota`} className="wb-tiendas-contacto-nota">Se abrirá WhatsApp para enviar tu mensaje</p>
    </div>
    {/* CF7's response box: always in the page so screen readers hear each new message. */}
    <div className={`wb-tiendas-contacto-respuesta${respuesta ? ` wb-aviso${respuesta.error ? ' wb-aviso--error' : ''}` : ''}`} role="status" aria-live="polite">
      {respuesta?.texto}
    </div>
  </form>;
}
