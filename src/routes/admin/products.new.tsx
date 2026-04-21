import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { STORAGE_BUCKET } from '@/lib/storage-utils'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

export const Route = createFileRoute('/admin/products/new')({
  component: NewProductPage,
})

function NewProductPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrl = ''
      if (image) {
        const dotIndex = image.name.lastIndexOf('.')
        if (dotIndex === -1 || dotIndex === image.name.length - 1) {
          throw new Error('El archivo de imagen debe tener una extensión válida (ej: .jpg, .png, .webp)')
        }
        const fileExt = image.name.slice(dotIndex + 1).toLowerCase()
        const filestamp = Date.now()
        const productSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const filePath = `${productSlug}/${filestamp}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, image)
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
        imageUrl = data.publicUrl
      }

      const { error: insertError } = await supabase.from('products').insert({
        name,
        description,
        price: parseFloat(price),
        category,
        image_url: imageUrl,
        is_active: true,
      })
      if (insertError) throw insertError
      navigate({ to: '/admin' })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al agregar el producto')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin" className="font-mono-label text-ink-500 mb-2 block hover:text-ink-900 transition-colors">
            ← Volver a productos
          </Link>
          <h1 className="font-serif text-[44px] m-0 tracking-tight">Nuevo producto</h1>
        </div>
        <div className="flex gap-2.5">
          <Link to="/admin"><Button variant="ghost">Descartar</Button></Link>
          <Button icon="check" onClick={() => (document.getElementById('product-form') as HTMLFormElement)?.requestSubmit()} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Left: form sections */}
          <div className="flex flex-col gap-7">
            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-5">Información básica</div>
              <div className="flex flex-col gap-4">
                <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Almendras naturales" required />
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-ink-700 font-medium">Descripción</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder="Cuenta la historia del producto…"
                    className="w-full py-3 px-3.5 bg-cream-50 rounded-lg font-sans text-sm text-ink-900 border border-cream-300 outline-none resize-y focus:border-ink-900 transition-colors"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono-label text-ink-700 font-medium">Categoría</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="py-3 px-3.5 border border-cream-300 rounded-lg bg-cream-50 font-sans text-sm text-ink-900 focus:border-ink-900 transition-colors"
                    >
                      <option value="">Selecciona…</option>
                      <option value="Almendras">Almendras</option>
                      <option value="Nueces">Nueces</option>
                      <option value="Cereales">Cereales</option>
                      <option value="Semillas">Semillas</option>
                      <option value="Mix">Mix</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </label>
                  <Input
                    label="Precio"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="100"
                    placeholder="15000"
                    icon="scale"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right: image */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6 self-start">
            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-3.5">Imagen</div>
              <div className="aspect-square rounded-[10px] border-2 border-dashed border-cream-300 flex flex-col items-center justify-center gap-2.5 text-ink-500 mb-3 cursor-pointer">
                <Icon name="upload" size={26} />
                <div className="font-sans text-[13px]">Arrastra una foto aquí</div>
                <div className="font-mono-label text-[10px]">JPG / PNG · máx 5 MB</div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
                className="w-full font-sans text-sm text-ink-900"
              />
            </section>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-terracota/10 text-terracota-dk p-3 rounded-lg font-sans text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
