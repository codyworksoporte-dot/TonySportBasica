'use client';
/*
 * FormularioContacto: the official Contact Form 7 of /contacto/ (same fields, placeholders and order:
 * Nombre*, Correo electrónico*, Cel/WhatsApp, Mensaje*, the "¿Cuánto es 5 + 3?" quiz and «Enviar Mensaje»).
 * The official form posts to WordPress; this one opens WhatsApp (wa.me/50370155571) with the message built
 * from the fields, and says so next to the button. No props.
 */
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import Boton from '@/components/espejo/Boton';
import './tiendas-contacto.css';

const WHATSAPP = 'https://wa.me/50370155571';
const QUIZ_ERROR = 'La respuesta al cuestionario no es correcta.';

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
  const [estado, setEstado] = useState('');

  const revisarQuiz = (evento: ChangeEvent<HTMLInputElement>) => {
    const valor = evento.currentTarget.value.trim();
    evento.currentTarget.setCustomValidity(valor && valor !== '8' ? QUIZ_ERROR : '');
  };

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    if (!formulario.reportValidity()) return;
    const datos = new FormData(formulario);
    const campo = (nombre: string) => String(datos.get(nombre) ?? '').trim();
    const texto = [
      `Nombre: ${campo('nombre')}`,
      `Correo electrónico: ${campo('email')}`,
      campo('telefono') ? `Cel/WhatsApp: ${campo('telefono')}` : '',
      `Mensaje: ${campo('mensaje')}`,
    ].filter(Boolean).join('\n');
    abrirWhatsApp(texto);
    setEstado('Abrimos WhatsApp con tu mensaje.');
  };

  return <form className="wb-form wb-tiendas-contacto-form" onSubmit={enviar} aria-describedby={`${id}-nota`}>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={`${id}-nombre`}>Nombre (obligatorio)</label>
      <input id={`${id}-nombre`} type="text" name="nombre" placeholder="Nombre*" autoComplete="name" required/>
    </p>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={`${id}-email`}>Correo electrónico (obligatorio)</label>
      <input id={`${id}-email`} type="email" name="email" placeholder="Correo electrónico*" autoComplete="email" required/>
    </p>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={`${id}-telefono`}>Cel/WhatsApp</label>
      <input id={`${id}-telefono`} type="tel" name="telefono" placeholder="Cel/WhatsApp" autoComplete="tel" inputMode="tel"/>
    </p>
    <p className="wb-campo">
      <label className="tc-sr" htmlFor={`${id}-mensaje`}>Mensaje (obligatorio)</label>
      <textarea id={`${id}-mensaje`} name="mensaje" placeholder="Mensaje*" rows={5} required/>
    </p>
    <p className="wb-campo">
      <label className="wb-etiqueta" htmlFor={`${id}-quiz`}>¿Cuánto es 5 + 3?</label>
      <input id={`${id}-quiz`} type="text" name="capital-quiz" inputMode="numeric" autoComplete="off" required onChange={revisarQuiz}/>
    </p>
    <div className="wb-tiendas-contacto-envio">
      <Boton type="submit" tamano="sm">Enviar Mensaje</Boton>
      <p id={`${id}-nota`} className="wb-tiendas-contacto-nota">Se abrirá WhatsApp para enviar tu mensaje</p>
    </div>
    {/* Sighted users see the new WhatsApp tab; screen readers hear it here. */}
    <p className="tc-sr" role="status">{estado}</p>
  </form>;
}
