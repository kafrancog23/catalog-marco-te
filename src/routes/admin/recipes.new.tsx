import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export const Route = createFileRoute('/admin/recipes/new')({
  component: NewRecipePage,
})

function NewRecipePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [category, setCategory] = useState('General')
  const [ingredients, setIngredients] = useState('')
  const [relatedProducts, setRelatedProducts] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const products = relatedProducts
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)

      const { error: insertError } = await supabase.from('recipes').insert({
        title,
        description,
        youtube_url: youtubeUrl,
        category,
        ingredients,
        related_products: products.length > 0 ? products : null,
        is_active: true,
      })

      if (insertError) throw insertError
      navigate({ to: '/admin/recipes' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la receta')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin/recipes" className="font-mono-label text-ink-500 mb-2 block hover:text-ink-900 transition-colors">
            ← Volver a recetas
          </Link>
          <h1 className="font-serif text-[44px] m-0 tracking-tight">Nueva receta</h1>
        </div>
        <div className="flex gap-2.5">
          <Link to="/admin/recipes"><Button variant="ghost">Descartar</Button></Link>
          <Button icon="check" onClick={() => (document.getElementById('recipe-form') as HTMLFormElement)?.requestSubmit()} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      <form id="recipe-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="flex flex-col gap-7">
            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-5">Información de la receta</div>
              <div className="flex flex-col gap-4">
                <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Granola casera con miel" required />
                <Input label="URL de YouTube" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-ink-700 font-medium">Descripción</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Breve descripción de la receta..."
                    className="w-full py-3 px-3.5 bg-cream-50 rounded-lg font-sans text-sm text-ink-900 border border-cream-300 outline-none resize-y focus:border-ink-900 transition-colors"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono-label text-ink-700 font-medium">Categoría</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="py-3 px-3.5 border border-cream-300 rounded-lg bg-cream-50 font-sans text-sm text-ink-900 focus:border-ink-900 transition-colors"
                    >
                      <option value="Desayuno">Desayuno</option>
                      <option value="Almuerzo">Almuerzo</option>
                      <option value="Snack">Snack</option>
                      <option value="Bebida">Bebida</option>
                      <option value="Postre">Postre</option>
                      <option value="General">General</option>
                    </select>
                  </label>
                  <Input
                    label="Productos relacionados"
                    value={relatedProducts}
                    onChange={(e) => setRelatedProducts(e.target.value)}
                    placeholder="Almendras, Quinoa, ..."
                    hint="Separados por coma"
                  />
                </div>
              </div>
            </section>

            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-5">Ingredientes</div>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={6}
                placeholder="Un ingrediente por línea:&#10;1 taza de avena&#10;½ taza de almendras&#10;..."
                className="w-full py-3 px-3.5 bg-cream-50 rounded-lg font-sans text-sm text-ink-900 border border-cream-300 outline-none resize-y focus:border-ink-900 transition-colors"
              />
            </section>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-6 self-start">
            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-3.5">Vista previa</div>
              {youtubeUrl && (() => {
                const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?\s]+)/)
                const videoId = match ? match[1] : null
                if (!videoId) return <div className="font-sans text-sm text-ink-500">URL no válida</div>
                return (
                  <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Preview"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                )
              })()}
              {!youtubeUrl && (
                <div className="aspect-video rounded-lg bg-cream-200 flex items-center justify-center text-ink-500 font-sans text-sm">
                  Pega una URL de YouTube para ver la vista previa
                </div>
              )}
            </section>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-terracota/10 text-terracota-dk p-3 rounded-lg font-sans text-sm">{error}</div>
        )}
      </form>
    </div>
  )
}
