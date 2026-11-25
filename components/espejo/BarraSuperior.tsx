/*
 * BarraSuperior: the official top contact bar (62 px, centred): slogan, WhatsApp, e-mail, Facebook and
 * Instagram. Phones show only the four icons, like the official. No props; texts from BARRA_SUPERIOR.
 */
import Icon from '@/components/Icon';
import { BARRA_SUPERIOR as B } from '@/lib/oficial/menu';
import IconoEspejo from './Iconos';
import './espejo-chrome.css';

const NUEVA = ' (se abre en otra pestaña)';

export default function BarraSuperior() {
  return <div className="wb-barra-superior">
    <div className="wb-barra-superior-in">
      <p className="wb-barra-lema">{B.lema}</p>
      <ul className="wb-barra-lista" aria-label="Contacto y redes sociales">
        <li className="wb-barra-wa">
          <a href={B.whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={`${B.whatsapp.etiqueta}: ${B.whatsapp.texto}${NUEVA}`}>
            <span className="wb-barra-icono"><Icon name="whatsapp-solid" size={19}/></span>
            <span className="wb-barra-texto">{B.whatsapp.texto}</span>
          </a>
        </li>
        <li className="wb-barra-correo">
          <a href={B.correo.href} aria-label={`${B.correo.etiqueta}: ${B.correo.texto}`}>
            <span className="wb-barra-icono"><IconoEspejo nombre="correo" size={18}/></span>
            <span className="wb-barra-texto">{B.correo.texto}</span>
          </a>
        </li>
        <li>
          <a href={B.facebook.href} target="_blank" rel="noopener noreferrer" aria-label={`${B.facebook.etiqueta}${NUEVA}`}>
            <span className="wb-barra-icono"><IconoEspejo nombre="facebook" size={19}/></span>
          </a>
        </li>
        <li>
          <a href={B.instagram.href} target="_blank" rel="noopener noreferrer" aria-label={`${B.instagram.etiqueta}${NUEVA}`}>
            <span className="wb-barra-icono"><IconoEspejo nombre="instagram" size={19}/></span>
          </a>
        </li>
      </ul>
    </div>
  </div>;
}
