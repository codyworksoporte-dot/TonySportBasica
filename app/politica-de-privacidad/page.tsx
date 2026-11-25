import type { Metadata } from 'next';
import BandaCTA from '@/components/espejo/BandaCTA';
import TituloPagina from '@/components/espejo/TituloPagina';
import { enlaceLocal } from '@/lib/oficial/enlaces';
import '@/components/espejo/contenido/contenido.css';

// Mirror of https://www.tonysportselsalvador.com/politica-de-privacidad/: photo banner with the title, the
// full official text and the "¿No encontraste lo que buscabas?" band.
export const metadata: Metadata = { title: 'Política de privacidad' };

export default function PoliticaDePrivacidadPage() {
  return <main id="contenido">
    <TituloPagina titulo="Política de privacidad" imagen="https://www.tonysportselsalvador.com/wp-content/uploads/2017/12/fondo-politica-de-privacidad.jpg"
      alto={{ escritorio: 274, movil: 279 }} className="wb-contenido-tp"/>
    <section className="wb-contenido-politica" aria-labelledby="politica-texto">
      <div className="wb-contenedor">
        <div className="wb-contenido wb-contenido-politica-texto">
          <h2 id="politica-texto">POLÍTICA DE PRIVACIDAD</h2>
          <p>La presente Política de privacidad establece los términos en que usamos y protegemos la información que es proporcionada por nuestros usuarios al momento de utilizar nuestro sitio web. Somos una compañía que está comprometida con la seguridad de los datos de nuestros usuarios. Cuando le pedimos llenar los campos de información personal con la cual usted pueda ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento. Sin embargo esta Política de privacidad puede cambiar con el tiempo o ser actualizada, por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.</p>
          <h3>Información que es recogida</h3>
          <p>Nuestro sitio web podrá recoger información personal, por ejemplo: información de contacto como su nombre, teléfono, dirección de correo electrónico e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar algún pedido o realizar una entrega o facturación.</p>
          <h3>Uso de la información recogida</h3>
          <p>Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.</p>
          <p>Estamos altamente comprometidos para cumplir con el compromiso de mantener su información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.</p>
          <h3>Cookies</h3>
          <p>Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar, dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las páginas web pueden reconocerte individualmente, y por lo tanto brindarte el mejor servicio personalizado de su web.</p>
          <p>Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadísticos, y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio en los sitios web, éstas no dan acceso a información de su ordenador ni de usted, a menos que usted así lo quiera y la proporcione directamente. Usted puede aceptar o negar el uso de cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente pues sirve para tener un mejor servicio web. También usted puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.</p>
          <h3>Enlaces a terceros</h3>
          <p>Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted de clic en estos enlaces y abandone nuestra página web, ya no tenemos control sobre el sitio al que es redirigido y por lo tanto no somos responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios de terceros. Dichos sitios están sujetos a sus propias políticas de privacidad, por lo cual es recomendable que las consulte para confirmar que usted está de acuerdo con estas.</p>
          <h3>Control de su información personal</h3>
          <p>No venderemos, cederemos ni distribuiremos la información personal que es recopilada sin su consentimiento, salvo que sea requerido por un juez con una orden judicial.</p>
          <p>Nos reservamos el derecho de cambiar los términos de la presente Política de privacidad en cualquier momento.</p>
        </div>
      </div>
    </section>
    <BandaCTA texto="¿No encontraste lo que buscabas?, mándanos un mensaje para ayudarte" boton={{ texto: 'Contáctanos', href: enlaceLocal('/contacto/') }}/>
  </main>;
}
