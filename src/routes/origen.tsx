import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const Route = createFileRoute('/origen')({
  component: OrigenPage,
})

const valores = [
  {
    titulo: 'Trazabilidad',
    texto: 'Cada producto lleva el nombre de su productor. Sabemos de qué finca viene cada lote, en qué mes se cosechó y cómo se procesó.',
    icono: '01',
  },
  {
    titulo: 'Frescura real',
    texto: 'No tenemos bodegas llenas. Empacamos en la semana que compras. Lo que no se vende fresco, no se vende.',
    icono: '02',
  },
  {
    titulo: 'Comercio directo',
    texto: 'Compramos sin intermediarios. El productor recibe un precio justo y tú recibes un producto sin marcas de tiempo en estantes.',
    icono: '03',
  },
  {
    titulo: 'Sin aditivos',
    texto: 'Nada de azúcar añadida, saborizantes o conservantes. Lo que llega a tu bolsa es exactamente lo que salió del campo.',
    icono: '04',
  },
]

const origenes = [
  { pais: 'Colombia', productos: 'Café, cacao, panela', detalle: 'Eje cafetero, Santander, Huila' },
  { pais: 'Estados Unidos', productos: 'Almendras, arándanos', detalle: 'California, Oregón' },
  { pais: 'México', productos: 'Nuez pecana', detalle: 'Sonora, Chihuahua' },
  { pais: 'Vietnam', productos: 'Castaña de cajú', detalle: 'Bình Phước' },
  { pais: 'Irán', productos: 'Pistacho', detalle: 'Kermán' },
  { pais: 'Bolivia', productos: 'Chía, quinoa', detalle: 'Altiplano' },
  { pais: 'Perú', productos: 'Quinoa, sacha inchi', detalle: 'Puno, San Martín' },
  { pais: 'Argentina', productos: 'Semillas de girasol', detalle: 'Pampa húmeda' },
  { pais: 'Canadá', productos: 'Avena', detalle: 'Saskatchewan' },
  { pais: 'Jordania', productos: 'Dátiles Medjool', detalle: 'Valle del Jordán' },
]

function OrigenPage() {
  return (
    <div className="min-h-screen bg-cream-100 text-ink-900">
      <Header />

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-8 pt-14 pb-16 border-b border-cream-300">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-end">
          <div>
            <div className="font-mono-label text-ink-500 mb-6">
              Nuestro origen
            </div>
            <h1 className="font-serif font-normal text-[clamp(44px,7vw,96px)] leading-[0.95] tracking-tight m-0 text-balance">
              Sabemos de dónde<br />
              <span className="italic text-terracota-dk">viene cada grano</span>.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed text-ink-500 max-w-[520px] mt-6 text-pretty">
              Desde 2009 en Bogotá, seleccionamos frutos secos, semillas y cereales de
              productores que conocemos por nombre. No somos intermediarios: somos el puente
              entre el campo y tu mesa.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="bg-cream-200 rounded-card p-10 border border-cream-300">
              <div className="font-mono-label text-ink-500 mb-4">En números</div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-serif text-[48px] tracking-tight leading-none">15+</div>
                  <div className="font-sans text-sm text-ink-500 mt-1">años en el oficio</div>
                </div>
                <div>
                  <div className="font-serif text-[48px] tracking-tight leading-none">10</div>
                  <div className="font-sans text-sm text-ink-500 mt-1">países de origen</div>
                </div>
                <div>
                  <div className="font-serif text-[48px] tracking-tight leading-none">40+</div>
                  <div className="font-sans text-sm text-ink-500 mt-1">productos en catálogo</div>
                </div>
                <div>
                  <div className="font-serif text-[48px] tracking-tight leading-none">0</div>
                  <div className="font-sans text-sm text-ink-500 mt-1">aditivos artificiales</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="max-w-[1400px] mx-auto px-8 py-20 border-b border-cream-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="font-mono-label text-ink-500 mb-4">Nuestra historia</div>
            <h2 className="font-serif font-normal text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-tight m-0">
              Un negocio que empezó<br />
              <span className="italic text-terracota-dk">con un costal</span>.
            </h2>
          </div>
          <div className="font-sans text-[15px] leading-[1.75] text-ink-700 flex flex-col gap-6">
            <p className="m-0">
              Marco Té nació el 11 de diciembre de 2009 en Bogotá.
              Marco, fundador del negocio, empezó vendiendo frutos secos y cereales
              que seleccionaba él mismo directamente de productores.
            </p>
            <p className="m-0">
              Con el tiempo, el negocio fue creciendo. Los clientes volvían porque confiaban
              en la frescura: cada producto se empaca con cuidado. Esa promesa
              no ha cambiado en más de quince años.
            </p>
            <p className="m-0">
              Hoy trabajamos directamente con productores en diez países. No compramos a
              distribuidores grandes: visitamos las fincas, probamos las cosechas y elegimos
              los lotes que cumplen con nuestro estándar.
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="max-w-[1400px] mx-auto px-8 py-20 border-b border-cream-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-cream-200 rounded-card border border-cream-300">
            <div className="font-mono-label text-ink-500 mb-3">Misión</div>
            <h3 className="font-serif font-normal text-[28px] leading-[1.15] tracking-tight m-0 mb-4">
              Llevar a cada mesa productos<br />
              <span className="italic text-terracota-dk">honestos y frescos</span>.
            </h3>
            <p className="font-sans text-[15px] leading-relaxed text-ink-700 m-0">
              Conectar directamente a los productores del campo con las familias colombianas,
              ofreciendo frutos secos, semillas y cereales sin aditivos, empacados con frescura
              garantizada y a precios justos para todos en la cadena.
            </p>
          </div>
          <div className="p-10 bg-ink-900 rounded-card text-cream-50">
            <div className="font-mono-label text-cream-300 mb-3">Visión</div>
            <h3 className="font-serif font-normal text-[28px] leading-[1.15] tracking-tight m-0 mb-4">
              Ser la referencia en<br />
              <span className="italic text-mustard">granos de confianza</span>.
            </h3>
            <p className="font-sans text-[15px] leading-relaxed text-cream-300 m-0">
              Para 2030, ser la marca de frutos secos y cereales más confiable de Colombia:
              reconocida por su trazabilidad, su frescura y su compromiso con el comercio
              directo. Que cuando alguien piense en calidad, piense en Marco Té.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="max-w-[1400px] mx-auto px-8 py-20 border-b border-cream-300">
        <div className="font-mono-label text-ink-500 mb-4">Lo que nos mueve</div>
        <h2 className="font-serif font-normal text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-tight m-0 mb-12">
          Cuatro principios,<br />
          <span className="italic text-terracota-dk">sin excepciones</span>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {valores.map((v) => (
            <div key={v.icono} className="p-8 border border-cream-300 rounded-card bg-cream-50">
              <div className="flex items-start gap-5">
                <div className="font-serif text-[40px] italic text-cream-300 leading-none select-none">
                  {v.icono}
                </div>
                <div>
                  <h3 className="font-serif text-[22px] font-normal tracking-tight m-0 mb-2">
                    {v.titulo}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-ink-500 m-0">
                    {v.texto}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mapa de orígenes */}
      <section className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="font-mono-label text-ink-500 mb-4">De dónde viene todo</div>
        <h2 className="font-serif font-normal text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-tight m-0 mb-12">
          Nuestros <span className="italic text-terracota-dk">orígenes</span>.
        </h2>

        <div className="border border-cream-300 rounded-[12px] overflow-hidden bg-cream-50">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1.2fr_1fr] px-6 py-3 border-b border-cream-300 bg-cream-200 font-mono-label text-ink-500">
            <div>País</div>
            <div>Productos</div>
            <div>Región</div>
          </div>
          {origenes.map((o, i) => (
            <div
              key={o.pais}
              className={`grid grid-cols-[1fr_1.2fr_1fr] px-6 py-4 items-center hover:bg-cream-200 transition-colors ${
                i < origenes.length - 1 ? 'border-b border-cream-300' : ''
              }`}
            >
              <div className="font-serif text-[17px]">{o.pais}</div>
              <div className="font-sans text-sm text-ink-700">{o.productos}</div>
              <div className="font-mono-label text-ink-500 text-[10.5px]">{o.detalle}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
