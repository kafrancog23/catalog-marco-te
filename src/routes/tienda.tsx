import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const Route = createFileRoute('/tienda')({
  component: TiendaPage,
})

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?\s]+)/)
  return match ? match[1] : null
}

function TiendaPage() {
  const [filtro, setFiltro] = useState('Todas')

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const categorias = useMemo(() => {
    if (!recipes) return []
    const cats = [...new Set(recipes.map((r) => r.category))]
    return cats
  }, [recipes])

  const filtradas = useMemo(() => {
    if (!recipes) return []
    if (filtro === 'Todas') return recipes
    return recipes.filter((r) => r.category === filtro)
  }, [recipes, filtro])

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900">
      <Header />

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-8 pt-14 pb-10 border-b border-cream-300">
        <div className="max-w-[720px]">
          <div className="font-mono-label text-ink-500 mb-6">
            Recetas con Marco Té
          </div>
          <h1 className="font-serif font-normal text-[clamp(44px,7vw,96px)] leading-[0.95] tracking-tight m-0 text-balance">
            Ideas para<br />
            <span className="italic text-terracota-dk">usar tus granos</span>.
          </h1>
          <p className="font-sans text-[17px] leading-relaxed text-ink-500 max-w-[520px] mt-6 text-pretty">
            Recetas simples con productos de nuestro catálogo. Preparaciones que puedes
            hacer en casa con lo que encuentras en nuestro catálogo.
          </p>
        </div>
      </section>

      {/* Filtros */}
      {categorias.length > 1 && (
        <section className="max-w-[1400px] mx-auto px-8 py-5 border-b border-cream-300">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltro('Todas')}
              className={`px-3.5 py-2 rounded-pill font-sans text-[13px] font-medium border cursor-pointer transition-all ${
                filtro === 'Todas'
                  ? 'bg-ink-900 text-cream-50 border-ink-900'
                  : 'bg-transparent text-ink-700 border-cream-300 hover:border-ink-500'
              }`}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                className={`px-3.5 py-2 rounded-pill font-sans text-[13px] font-medium border cursor-pointer transition-all ${
                  filtro === cat
                    ? 'bg-ink-900 text-cream-50 border-ink-900'
                    : 'bg-transparent text-ink-700 border-cream-300 hover:border-ink-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Grid de recetas */}
      <section className="max-w-[1400px] mx-auto px-8 py-10 pb-20">
        {isLoading && (
          <div className="text-center py-20">
            <div className="font-serif text-2xl italic">Cargando recetas...</div>
          </div>
        )}

        {!isLoading && filtradas.length > 0 && (
          <>
            <div className="font-mono-label text-ink-500 mb-6">
              {filtradas.length} {filtradas.length === 1 ? 'receta' : 'recetas'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtradas.map((receta) => {
                const videoId = extractYoutubeId(receta.youtube_url)
                return (
                  <article
                    key={receta.id}
                    className="bg-cream-50 rounded-card border border-cream-300 overflow-hidden"
                  >
                    {/* Video embed */}
                    {videoId && (
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={receta.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono-label text-ink-500 text-[10px]">{receta.category}</span>
                      </div>

                      <h3 className="font-serif font-normal text-[22px] leading-tight tracking-tight m-0 mb-2">
                        {receta.title}
                      </h3>

                      {receta.description && (
                        <p className="font-sans text-sm text-ink-500 leading-relaxed m-0 mb-4">
                          {receta.description}
                        </p>
                      )}

                      {/* Ingredientes */}
                      {receta.ingredients && (
                        <div className="mt-3 pt-3 border-t border-cream-300">
                          <div className="font-mono-label text-ink-500 text-[10px] mb-2">Ingredientes</div>
                          <p className="font-sans text-sm text-ink-700 leading-relaxed m-0 whitespace-pre-line">
                            {receta.ingredients}
                          </p>
                        </div>
                      )}

                      {/* Productos relacionados */}
                      {receta.related_products && receta.related_products.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-cream-300">
                          <div className="font-mono-label text-ink-500 text-[10px] mb-2">Productos Marco Té</div>
                          <div className="flex flex-wrap gap-1.5">
                            {receta.related_products.map((p: string) => (
                              <span key={p} className="font-serif text-[13px] italic text-ink-900 px-2 py-0.5 bg-mustard/20 rounded-pill">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}

        {!isLoading && filtradas.length === 0 && (
          <div className="py-20 text-center">
            <div className="font-serif text-[32px] italic text-ink-900 mb-2.5">
              Aún no hay recetas.
            </div>
            <div className="font-sans text-sm text-ink-500">
              Pronto publicaremos nuevas ideas para usar tus granos.
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
