import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Explora nuestra variedad de frutos secos y cereales de calidad premium.',
};

export default function CatalogoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8">
        Nuestro Catálogo
      </h1>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
        <p className="text-lg text-stone-600 mb-4">
          El catálogo de productos estará disponible pronto.
        </p>
        <p className="text-stone-500">
          Conecta Supabase y agrega productos desde el panel de administración.
        </p>
      </div>
    </div>
  );
}
