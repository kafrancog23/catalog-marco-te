import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import DeleteButton from '@/components/DeleteButton'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
})

const fmt$ = (n: number) => '$' + n.toLocaleString('es-CO')

function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const { data: products } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const kpis = useMemo(() => {
    if (!products) return { active: 0, inactive: 0, categories: 0 }
    return {
      active: products.filter((p) => p.is_active).length,
      inactive: products.filter((p) => !p.is_active).length,
      categories: new Set(products.map((p) => p.category)).size,
    }
  }, [products])

  const filtered = useMemo(() => {
    if (!products) return []
    if (!searchQuery) return products
    const q = searchQuery.toLowerCase()
    return products.filter((p) => (p.name + p.category).toLowerCase().includes(q))
  }, [products, searchQuery])

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="font-mono-label text-ink-500 mb-1.5">
            Inventario
          </div>
          <h1 className="font-serif text-[44px] m-0 tracking-tight">Productos</h1>
        </div>
        <Link to="/admin/products/new">
          <Button icon="plus">Nuevo producto</Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7">
        {[
          { label: 'Activos', value: kpis.active },
          { label: 'Inactivos', value: kpis.inactive },
          { label: 'Categorías', value: kpis.categories },
          { label: 'Total', value: products?.length || 0 },
        ].map((k) => (
          <div key={k.label} className="p-5 border border-cream-300 rounded-[12px] bg-cream-50">
            <div className="font-mono-label text-ink-500">{k.label}</div>
            <div className="font-serif text-4xl tracking-tight mt-1">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 items-center mb-5">
        <div className="relative flex-1 max-w-[320px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500">
            <Icon name="search" size={15} />
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full py-2 px-3.5 pl-9 border border-cream-300 rounded-lg bg-cream-50 font-sans text-[13px] text-ink-900 outline-none focus:border-ink-900 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-cream-300 rounded-[12px] overflow-hidden bg-cream-50">
        {/* Header */}
        <div className="grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_100px] px-5 py-3 border-b border-cream-300 bg-cream-200 font-mono-label text-ink-500">
          <div />
          <div>Producto</div>
          <div>Categoría</div>
          <div>Precio</div>
          <div>Estado</div>
          <div />
        </div>

        {/* Rows */}
        {filtered.map((product, i) => (
          <div
            key={product.id}
            className={`grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_100px] px-5 py-3.5 items-center hover:bg-cream-200 transition-colors ${
              i < filtered.length - 1 ? 'border-b border-cream-300' : ''
            }`}
          >
            <div className="w-11 h-11 rounded-md overflow-hidden bg-cream-200">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-serif text-[17px]">{product.name}</div>
              <div className="font-mono-label text-ink-500 text-[10.5px] mt-0.5">
                {product.description?.slice(0, 40)}
              </div>
            </div>
            <div className="font-sans text-[13px] text-ink-500">{product.category}</div>
            <div>
              <div className="font-serif text-[17px]">{fmt$(product.price)}</div>
            </div>
            <div>
              <Badge tone={product.is_active ? 'active' : 'inactive'}>
                {product.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <div className="flex gap-1 justify-end">
              <Link
                to="/admin/products/$id/edit"
                params={{ id: product.id }}
                className="p-1.5 text-ink-500 hover:text-ink-900 transition-colors"
              >
                <Icon name="edit" size={15} />
              </Link>
              <DeleteButton productId={product.id} productName={product.name} />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-ink-500 font-sans text-sm">
            No hay productos.
          </div>
        )}
      </div>
    </div>
  )
}
