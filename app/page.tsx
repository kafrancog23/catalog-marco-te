import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function Home() {
  const { data: products, error } = await supabase
  .from('products')
  .select('*')

  return (
    <div className="min-h-screen justify-center bg-gray-50">
     <header className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Catálogo de Frutos Secos y Cereales
          </h1>
          <p className=" text-xl text-gray-600 mt-4">
          Calidad y frescura desde hace más de 20 años
          </p>
      </header>
      <main className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Productos destacados ({products?.length || 0})
        </h2>

        {error && (<p className="text-red-500 mb-4">Error: {error.message}</p>)}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div>
                <Image src={product.image_url} alt={product.name} width={300} height={300} className="w-full h-48 object-cover" />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div>
                  <span className="text-gray-600 mb-4">{product.price.toLocaleString('es-CO')}</span>
                  <span className="text-gray-600 mb-4">{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products && products.length === 0 && (
          <p className="text-gray-600 mb-4">No hay productos aún. Agrega algunos desde el panel admin.</p>
        )}
      </main>
    </div>
  );
}
