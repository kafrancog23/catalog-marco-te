import { Phone, MapPin, Clock } from 'lucide-react';
import { COMPANY, WHATSAPP_NUMBER } from '@/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacto" className="bg-stone-900 text-stone-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{COMPANY.name}</h3>
            <p className="text-stone-400 mb-4">{COMPANY.description}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Colombia</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Lun - Sáb: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="hover:text-amber-400 transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/catalogo"
                  className="hover:text-amber-400 transition-colors"
                >
                  Catálogo
                </a>
              </li>
              <li>
                <a
                  href="/#nosotros"
                  className="hover:text-amber-400 transition-colors"
                >
                  Nosotros
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-500">
          <p>&copy; {currentYear} {COMPANY.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
