import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

export const Route = createFileRoute('/admin/recipes')({
  component: AdminRecipesPage,
})

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?\s]+)/)
  return match ? match[1] : null
}

function AdminRecipesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  const { data: recipes } = useQuery({
    queryKey: ['recipes', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const filtered = recipes?.filter((r) =>
    !searchQuery || (r.title + r.category).toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar la receta "${title}"?`)) return
    await supabase.from('recipes').delete().eq('id', id)
    queryClient.invalidateQueries({ queryKey: ['recipes'] })
  }

  const handleToggle = async (id: string, currentState: boolean) => {
    await supabase.from('recipes').update({ is_active: !currentState }).eq('id', id)
    queryClient.invalidateQueries({ queryKey: ['recipes'] })
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="font-mono-label text-ink-500 mb-1.5">Contenido</div>
          <h1 className="font-serif text-[44px] m-0 tracking-tight">Recetas</h1>
        </div>
        <Link to="/admin/recipes/new">
          <Button icon="plus">Nueva receta</Button>
        </Link>
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
            placeholder="Buscar receta…"
            className="w-full py-2 px-3.5 pl-9 border border-cream-300 rounded-lg bg-cream-50 font-sans text-[13px] text-ink-900 outline-none focus:border-ink-900 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-cream-300 rounded-[12px] overflow-hidden bg-cream-50">
        <div className="grid grid-cols-[80px_1.5fr_1fr_1fr_100px] px-5 py-3 border-b border-cream-300 bg-cream-200 font-mono-label text-ink-500">
          <div />
          <div>Receta</div>
          <div>Categoría</div>
          <div>Estado</div>
          <div />
        </div>

        {filtered.map((recipe, i) => {
          const videoId = extractYoutubeId(recipe.youtube_url)
          return (
            <div
              key={recipe.id}
              className={`grid grid-cols-[80px_1.5fr_1fr_1fr_100px] px-5 py-3.5 items-center hover:bg-cream-200 transition-colors ${
                i < filtered.length - 1 ? 'border-b border-cream-300' : ''
              }`}
            >
              <div className="w-16 h-10 rounded overflow-hidden bg-cream-200">
                {videoId && (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="font-serif text-[17px]">{recipe.title}</div>
                <div className="font-mono-label text-ink-500 text-[10.5px] mt-0.5 truncate max-w-[300px]">
                  {recipe.youtube_url}
                </div>
              </div>
              <div className="font-sans text-[13px] text-ink-500">{recipe.category}</div>
              <div>
                <button
                  onClick={() => handleToggle(recipe.id, recipe.is_active)}
                  className="bg-transparent border-none cursor-pointer p-0"
                >
                  <Badge tone={recipe.is_active ? 'active' : 'inactive'}>
                    {recipe.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </button>
              </div>
              <div className="flex gap-1 justify-end">
                <Link
                  to="/admin/recipes/$id/edit"
                  params={{ id: recipe.id }}
                  className="p-1.5 text-ink-500 hover:text-ink-900 transition-colors"
                >
                  <Icon name="edit" size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(recipe.id, recipe.title)}
                  className="p-1.5 text-ink-500 hover:text-terracota-dk transition-colors bg-transparent border-none cursor-pointer"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-ink-500 font-sans text-sm">
            No hay recetas.
          </div>
        )}
      </div>
    </div>
  )
}
