import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { extractStoragePath, STORAGE_BUCKET } from '@/lib/storage-utils'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

export const Route = createFileRoute('/admin/products/$id/edit')({
  component: EditProductPage,
})

function EditProductPage() {
  const { id } = Route.useParams()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (error) {
        setError('Producto no encontrado')
        setLoading(false)
        return
      }
      setName(data.name)
      setDescription(data.description)
      setPrice(data.price.toString())
      setCategory(data.category)
      setIsActive(data.is_active)
      setCurrentImageUrl(data.image_url)
      setLoading(false)
    }
    loadProduct()
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    let newFilePath: string | null = null

    try {
      let imageUrl = currentImageUrl
      let oldStoragePath: string | null = null

      if (newImage) {
        const fileExt = newImage.name.split('.').pop()
        if (!fileExt) throw new Error('El archivo debe tener una extensión válida')

        const timestamp = Date.now()
        const productSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        newFilePath = `${productSlug}/${timestamp}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(newFilePath, newImage)
        if (uploadError) throw uploadError

        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(newFilePath)
        imageUrl = data.publicUrl

        if (currentImageUrl) oldStoragePath = extractStoragePath(currentImageUrl)
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({ name, description, price: parseFloat(price), category, is_active: isActive, image_url: imageUrl })
        .eq('id', id)

      if (updateError) throw updateError

      if (oldStoragePath) {
        await supabase.storage.from(STORAGE_BUCKET).remove([oldStoragePath]).catch(() => {})
      }

      navigate({ to: '/admin' })
    } catch (err: unknown) {
      if (newFilePath) {
        await supabase.storage.from(STORAGE_BUCKET).remove([newFilePath]).catch(() => {})
      }
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-sans text-ink-500">Cargando producto...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/admin" className="font-mono-label text-ink-500 mb-2 block hover:text-ink-900 transition-colors">
            ← Volver a productos
          </Link>
          <h1 className="font-serif text-[44px] m-0 tracking-tight">Editar producto</h1>
        </div>
        <div className="flex gap-2.5">
          <Link to="/admin"><Button variant="ghost">Descartar</Button></Link>
          <Button icon="check" onClick={() => (document.getElementById('edit-form') as HTMLFormElement)?.requestSubmit()} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      <form id="edit-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Left: form */}
          <div className="flex flex-col gap-7">
            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-5">Información básica</div>
              <div className="flex flex-col gap-4">
                <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono-label text-ink-700 font-medium">Descripción</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
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
                  <Input label="Precio" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="100" icon="scale" />
                </div>
              </div>
            </section>
          </div>

          {/* Right: visibility + image */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6 self-start">
            {/* Visibility */}
            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-3.5">Visibilidad</div>
              <label className="flex justify-between items-center py-3 cursor-pointer">
                <div>
                  <div className="font-sans text-sm font-medium">Producto activo</div>
                  <div className="font-sans text-xs text-ink-500 mt-0.5">Se muestra en el catálogo público</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className="w-11 h-[26px] rounded-pill border-none cursor-pointer relative transition-colors duration-200"
                  style={{ background: isActive ? 'var(--color-ink-900)' : 'var(--color-cream-300)' }}
                >
                  <span
                    className="absolute top-[3px] w-5 h-5 rounded-full bg-cream-100 transition-[left] duration-200"
                    style={{ left: isActive ? 21 : 3, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                  />
                </button>
              </label>
            </section>

            {/* Image */}
            <section className="p-6 border border-cream-300 rounded-[12px] bg-cream-50">
              <div className="font-mono-label text-ink-500 mb-3.5">Imagen</div>
              {currentImageUrl && (
                <div className="aspect-square rounded-[10px] overflow-hidden mb-3">
                  <img src={currentImageUrl} alt="Imagen actual" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  className="w-full font-sans text-sm text-ink-900"
                />
                <p className="font-sans text-xs text-ink-500">Deja vacío si no quieres cambiar la imagen</p>
              </div>
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
