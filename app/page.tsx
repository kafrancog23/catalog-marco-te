import { supabase } from "@/lib/supabase";

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

        {products && products.length === 0 && (
          <p className="text-gray-600 mb-4">No hay productos aún. Agrega algunos desde el panel admin.</p>
        )}
      </main>
    </div>
  );
}
