import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'
import {createServerClient} from '@supabase/ssr'

export default async function AdminPage() {
    const cookiesStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookiesStore.getAll();
                },
                setAll(cookiesToSet) {
                    try{
                        cookiesToSet.forEach(({name, value, options}) => 
                            cookiesStore.set(name, value, options));
                    } catch{}
                },
            },
        }
    );

    const {data: {user} } = await supabase.auth.getUser()

    if(!user){
        redirect('/admin/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white text-gray-800 rounded-lg shadow-md p-8 mb-6 border border-gray-600">
                <h2 className="text-3xl font-bold mb-4">Panel de Administración</h2>
                <p className="text-gray-600">
                    Bienvenido, <span className="font-semibold">{user.email}</span>
                </p>
                </div>

                <div className="bg-white text-gray-800 rounded-lg shadow-md p-8 border border-gray-600">
                <h2 className="text-2xl font-semibold mb-6">Gestión de Productos</h2>
                <a href="/admin/products/new" className="block bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    + Agregar Producto
                </a>
                <p className="text-gray-500">
                    Aquí podrás agregar, editar y eliminar productos.
                </p>
                <p className="text-sm text-gray-400 mt-4">
                    (Próximamente: formulario para agregar productos)
                </p>
                </div>
            </div>
        </div>
    );
}