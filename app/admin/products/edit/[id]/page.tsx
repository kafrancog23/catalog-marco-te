'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter, useParams } from 'next/navigation'

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string
  
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
  const router = useRouter()

  // Cargar el producto actual
  useEffect(() => {
    async function loadProduct() {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      let imageUrl = currentImageUrl
      let oldImagePath: string | null = null

      // Si hay nueva imagen, subirla
      if (newImage) {
        const fileExt = newImage.name.split('.').pop()

        // Validar que tenga extensión
        if (!fileExt) {
          throw new Error('El archivo debe tener una extensión válida')
        }

        const timestamp = Date.now()
        const productSlug = name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')

        const filePath = `${productSlug}/${timestamp}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('products-images')
          .upload(filePath, newImage)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('products-images')
          .getPublicUrl(filePath)

        imageUrl = data.publicUrl

        // Preparar ruta de imagen anterior para eliminar después
        if (currentImageUrl) {
          const match = currentImageUrl.match(/\/public\/(.+)/)
          if (match && match[1]) {
            oldImagePath = match[1].replace('products-images/', '')
          }
        }
      }

      // Actualizar el producto
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name,
          description,
          price: parseFloat(price),
          category,
          is_active: isActive,
          image_url: imageUrl,
        })
        .eq('id', id)

      if (updateError) throw updateError

      // Eliminar imagen anterior DESPUÉS de actualizar BD exitosamente
      if (oldImagePath) {
        const { error: deleteError } = await supabase.storage
          .from('products-images')
          .remove([oldImagePath])

        if (deleteError) {
          console.warn('No se pudo eliminar imagen anterior:', deleteError)
        }
      }

      router.push('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando producto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8">Editar Producto</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del producto
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (pesos colombianos)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Almendras">Almendras</option>
                <option value="Nueces">Nueces</option>
                <option value="Cereales">Cereales</option>
                <option value="Semillas">Semillas</option>
                <option value="Mix">Mix</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Producto activo (visible en el catálogo)
                </span>
              </label>
            </div>

            {/* Imagen actual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen actual
              </label>
              {currentImageUrl && (
                <img
                  src={currentImageUrl}
                  alt="Imagen actual"
                  className="w-32 h-32 object-cover rounded border border-gray-300"
                />
              )}
            </div>

            {/* Nueva imagen (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cambiar imagen (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío si no quieres cambiar la imagen
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
