export const STORAGE_BUCKET = 'products-images'

const STORAGE_PUBLIC_PREFIX = `/storage/v1/object/public/${STORAGE_BUCKET}/`

export function extractStoragePath(imageUrl: string): string | null {
  try {
    const { pathname } = new URL(imageUrl)
    if (pathname.startsWith(STORAGE_PUBLIC_PREFIX)) {
      return pathname.slice(STORAGE_PUBLIC_PREFIX.length)
    }
  } catch {
    // URL inválida
  }
  return null
}
