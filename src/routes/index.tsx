import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AddToCartButton from '@/components/AddToCartButton'
import Chip from '@/components/ui/Chip'
import Icon from '@/components/ui/Icon'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const fmt$ = (n: number) => '$' + n.toLocaleString('es-CO')

function HomePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('todos')
  const [sort, setSort] = useState('relevance')

  const { data: products, error, isLoading } = useQuery({
    queryKey: ['products', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const categories = useMemo(() => {
    if (!products) return []
    const counts: Record<string, number> = {}
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return Object.entries(counts).map(([id, count]) => ({ id, label: id, count }))
  }, [products])

  const filtered = useMemo(() => {
    let list = products?.slice() || []
    if (category !== 'todos') list = list.filter((p) => p.category === category)
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((p) => (p.name + ' ' + p.description + ' ' + p.category).toLowerCase().includes(q))
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [products, category, query, sort])

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900">
      <Header />

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-8 pt-14 pb-10 border-b border-cream-300">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div>
            <div className="font-mono-label text-ink-500 mb-6">
              Catálogo
            </div>
            <h1 className="font-serif font-normal text-[clamp(44px,7vw,104px)] leading-[0.95] tracking-tight m-0 text-balance">
              Granos que viajan<br />
              <span className="italic text-terracota-dk">bien guardados</span>.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed text-ink-500 max-w-[520px] mt-6 text-pretty">
              Seleccionamos frutos secos, semillas y cereales de productores que conocemos
              por nombre. Cada bolsa se empaca en la semana que la compras.
            </p>
          </div>
          <div className="font-mono-label text-ink-500 text-right leading-relaxed hidden lg:block">
            <div>est. 2009</div>
            <div>bogotá · col</div>
            <div className="mt-2.5 text-ink-900">— 15 años —</div>
          </div>
        </div>
      </section>

      {/* Category filters + search */}
      <section
        className="sticky top-16 z-20 border-b border-cream-300"
        style={{ background: 'color-mix(in oklab, var(--color-cream-100) 88%, transparent)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex gap-2 flex-wrap flex-1 min-w-0">
              <Chip active={category === 'todos'} onClick={() => setCategory('todos')} count={products?.length}>
                Todos
              </Chip>
              {categories.map((c) => (
                <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} count={c.count}>
                  {c.label}
                </Chip>
              ))}
            </div>
            <div className="flex gap-2.5 items-center">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">
                  <Icon name="search" size={15} />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar…"
                  className="py-2 px-3.5 pl-9 border border-cream-300 rounded-pill bg-cream-50 font-sans text-[13px] text-ink-900 outline-none w-[220px] focus:border-ink-900 transition-colors"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="py-2 px-3 border border-cream-300 rounded-pill bg-cream-50 font-sans text-[13px] text-ink-900 cursor-pointer"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio ↑</option>
                <option value="price-desc">Precio ↓</option>
                <option value="name">A–Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-[1400px] mx-auto px-8 pt-8 pb-20">
        <div className="flex justify-between items-baseline mb-6">
          <div className="font-mono-label text-ink-500">
            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            {category !== 'todos' && (
              <> · <span className="text-ink-900">{category}</span></>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="font-serif text-2xl italic text-ink-900">Cargando...</div>
          </div>
        )}

        {error && (
          <div className="bg-terracota/10 text-terracota-dk p-4 rounded-card mb-6 font-sans text-sm">
            Error: {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <article
              key={product.id}
              className="bg-cream-50 rounded-card border border-cream-300 overflow-hidden cursor-pointer transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.22)]"
            >
              {/* Image */}
              <div className="relative aspect-square bg-cream-200 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-[18px]">
                <div className="font-mono-label text-ink-500 mb-2">
                  {product.category}
                </div>
                <h3 className="m-0 font-serif font-normal text-[22px] leading-tight tracking-tight text-ink-900">
                  {product.name}
                </h3>
                <div className="font-sans text-[13px] text-ink-500 mt-0.5 line-clamp-1">
                  {product.description}
                </div>

                <div className="flex items-center justify-between mt-[18px] pt-3.5 border-t border-cream-300">
                  <div>
                    <div className="font-serif text-xl text-ink-900 tracking-tight">
                      {fmt$(product.price)}
                    </div>
                  </div>
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
            </article>
          ))}
        </div>

        {filtered.length === 0 && !isLoading && (
          <div className="py-20 text-center text-ink-500 font-sans">
            <div className="font-serif text-[32px] italic text-ink-900 mb-2.5">
              Nada por acá.
            </div>
            <div>Prueba con otra categoría o cambia la búsqueda.</div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
