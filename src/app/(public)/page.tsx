import Link from 'next/link';
import { ArrowRight, Leaf, Award, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { COMPANY } from '@/constants';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-stone-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6">
              Frutos Secos y Cereales de{' '}
              <span className="text-amber-600">Calidad Premium</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 mb-8">
              {COMPANY.description} Descubre nuestra variedad de almendras,
              nueces, semillas y más, directamente a tu puerta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalogo">
                <Button size="lg" className="w-full sm:w-auto">
                  Ver Catálogo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#nosotros">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Conoce Más
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                100% Natural
              </h3>
              <p className="text-stone-600">
                Productos naturales sin aditivos ni conservantes artificiales.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                Calidad Premium
              </h3>
              <p className="text-stone-600">
                Seleccionamos solo los mejores productos para ti y tu familia.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                Entrega Rápida
              </h3>
              <p className="text-stone-600">
                Llevamos tus pedidos directamente hasta tu puerta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
              Sobre Nosotros
            </h2>
            <p className="text-lg text-stone-600 mb-8">
              Somos una empresa familiar con años de experiencia en la
              comercialización de frutos secos y cereales. Nuestro compromiso es
              ofrecer productos de la más alta calidad, manteniendo precios
              justos y un servicio cercano a nuestros clientes.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div>
                <div className="text-4xl font-bold text-amber-600">+70</div>
                <div className="text-stone-600">Productos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600">+500</div>
                <div className="text-stone-600">Clientes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600">+10</div>
                <div className="text-stone-600">Años</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-amber-600">100%</div>
                <div className="text-stone-600">Calidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para probar nuestros productos?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            Explora nuestro catálogo completo y arma tu pedido. Te contactamos
            por WhatsApp para finalizar tu compra.
          </p>
          <Link href="/catalogo">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-amber-600 hover:bg-amber-50"
            >
              Explorar Catálogo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
