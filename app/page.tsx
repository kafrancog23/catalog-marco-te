import { supabase } from "@/lib/supabase"
import Image from "next/image"
import CartButton from "@/components/CartButton"
import AddToCartButton from "@/components/AddToCartButton"

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)  // Solo productos activos
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con carrito */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Marco Té</h1>
            <p className="text-sm text-gray-600">Frutos secos y cereales</p>
          </div>
          <CartButton />
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-6xl mx-auto text-center py-12 px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Catálogo de Frutos Secos y Cereales
        </h2>
        <p className="text-xl text-gray-600">
          Calidad y frescura desde hace más de 20 años
        </p>
      </section>

      {/* Productos */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            Productos Disponibles ({products?.length || 0})
          </h3>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            Error: {error.message}
          </div>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Imagen */}
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Info del producto */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {product.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image_url: product.image_url,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay productos */}
        {products && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay productos disponibles.</p>
            <p className="text-gray-400 text-sm mt-2">
              Vuelve pronto para ver nuestras novedades.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}