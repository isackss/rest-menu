import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { notFound } from "next/navigation";

// Opcional: Generar metadatos dinámicos para SEO o al compartir por WhatsApp
export async function generateMetadata({ params }) {
  const { restaurantSlug } = await params;
  await dbConnect();
  const restaurant = await Restaurant.findOne({ slug: restaurantSlug }).lean();

  if (!restaurant) return { title: "Menú no encontrado" };
  return {
    title: `Menú | ${restaurant.name}`,
    description: restaurant.description,
  };
}

export default async function PublicMenuPage({ params }) {
  // En las versiones más recientes de Next.js (15 y 16), params es una promesa
  const { restaurantSlug } = await params;

  await dbConnect();

  // 1. Buscar el restaurante por su slug en la URL
  const restaurant = await Restaurant.findOne({
    slug: restaurantSlug,
    isActive: true,
  }).lean();

  // Si alguien escribe mal la URL o el restaurante está inactivo, lanzamos un 404
  if (!restaurant) {
    notFound();
  }

  // 2. Traer las categorías ordenadas
  const categories = await Category.find({ restaurantId: restaurant._id })
    .sort({ order: 1 })
    .lean();

  // 3. Traer solo los platos que estén marcados como disponibles (isAvailable: true)
  const menuItems = await MenuItem.find({
    restaurantId: restaurant._id,
    isAvailable: true,
  }).lean();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Cabecera del Restaurante */}
      <header className="bg-white px-6 py-8 shadow-sm text-center">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {restaurant.name}
        </h1>
        {restaurant.description && (
          <p className="text-gray-500 mt-2 text-sm">{restaurant.description}</p>
        )}
      </header>

      {/* Listado del Menú */}
      <main className="max-w-3xl mx-auto px-4 mt-8">
        {categories.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Este menú aún no tiene platos.
          </p>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              // Filtramos los platos que pertenecen a esta categoría específica
              const itemsInCategory = menuItems.filter(
                (item) =>
                  item.categoryId.toString() === category._id.toString(),
              );

              // Si una categoría no tiene platos disponibles, no la mostramos para no dejar espacios vacíos
              if (itemsInCategory.length === 0) return null;

              return (
                <section key={category._id} className="scroll-mt-6">
                  {/* Título de la Categoría */}
                  <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
                    {category.name}
                  </h2>

                  {/* Tarjetas de Platos */}
                  <div className="grid grid-cols-1 gap-4">
                    {itemsInCategory.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-gray-500 text-sm mt-1 leading-snug">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end justify-start">
                          {/* Formateamos el precio para que siempre tenga dos decimales */}
                          <span className="text-lg font-black text-blue-600">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Pie de página sutil */}
      <footer className="mt-16 text-center text-xs text-gray-400">
        <p>Menú digital creado con tu App</p>
      </footer>
    </div>
  );
}
