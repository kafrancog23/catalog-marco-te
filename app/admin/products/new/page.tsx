'use client'

import {useState} from 'react'
import {createClient} from '@/lib/supabase-client'
import {useRouter} from 'next/navigation'

export default function NewProductPage() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        
        try{
            const supabase = createClient()
            let imageUrl = ''
            if(image){
                const fileExt = image.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(fileName, image)

                if (uploadError) throw uploadError

                const {data} = supabase.storage.from('product-images').getPublicUrl(fileName)
                imageUrl = data.publicUrl
            }
            const {error: insertError} = await supabase
            .from('products')
            .insert({
                name,
                description,
                price: parseFloat(price),
                category,
                image_url: imageUrl,
                is_active: true,
            })
            if(insertError) throw insertError
            router.push('/admin')
        } catch(error){
            setError(error instanceof Error ? error.message : 'Error al agregar el producto')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold mb-8">Agregar Producto</h1>
    
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
                    placeholder="Ej: Almendras Premium"
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
                    placeholder="Describe el producto..."
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
                    placeholder="15000"
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
    
                {/* Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen del producto
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos: JPG, PNG, WEBP (máx. 5MB)
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
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Guardando...' : 'Guardar Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
}