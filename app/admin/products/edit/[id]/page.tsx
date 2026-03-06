'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase-client'
import { extractStoragePath, STORAGE_BUCKET } from '@/lib/storage-utils'
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    let newFilePath: string | null = null

    try {
      let imageUrl = currentImageUrl
      let oldStoragePath: string | null = null

      if (newImage) {
        const fileExt = newImage.name.split('.').pop()

        if (!fileExt) {
          throw new Error('El archivo debe tener una extensión válida')
        }

        const timestamp = Date.now()
        const productSlug = name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')

        newFilePath = `${productSlug}/${timestamp}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(newFilePath, newImage)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(newFilePath)

        imageUrl = data.publicUrl

        if (currentImageUrl) {
          oldStoragePath = extractStoragePath(currentImageUrl)
        }
      }

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
      if (oldStoragePath) {
        const { error: removeError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([oldStoragePath])

        if (removeError) {
          console.warn('No se pudo eliminar imagen anterior:', removeError)
        }
      }

      router.push('/admin')
    } catch (err: unknown) {
      // Si falla el update y ya subimos imagen nueva, limpiarla
      if (newFilePath) {
        await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([newFilePath])
          .catch(() => {})
      }
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

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
