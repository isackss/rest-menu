import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { notFound } from "next/navigation";

import FloatingCategoryNav from "@/components/menu/FloatingCategoryNav";

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
  const { restaurantSlug } = await params;

  await dbConnect();

  const restaurant = await Restaurant.findOne({
    slug: restaurantSlug,
    isActive: true,
  }).lean();

  if (!restaurant) {
    notFound();
  }

  const categories = await Category.find({ restaurantId: restaurant._id })
    .sort({ order: 1 })
    .lean();
  const menuItems = await MenuItem.find({
    restaurantId: restaurant._id,
    isAvailable: true,
  }).lean();

  // NUEVO: Filtramos para quedarnos solo con las categorías que no están vacías
  const populatedCategories = categories.filter((category) => {
    return menuItems.some(
      (item) => item.categoryId.toString() === category._id.toString(),
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* Cabecera Tipo "Hero" */}
      <header className="relative bg-white pt-12 pb-10 px-6 shadow-sm overflow-hidden text-center rounded-b-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-100 opacity-50"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Si tuvieras un logo, iría aquí */}
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
            {restaurant.name}
          </h1>
          {restaurant.description && (
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-md mx-auto">
              {restaurant.description}
            </p>
          )}
        </div>
      </header>

      {/* Contenedor Principal del Menú */}
      <main className="max-w-3xl mx-auto px-4 md:px-6">
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-400 font-medium">
              Este menú aún se está cocinando...
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {populatedCategories.map((category) => {
              const itemsInCategory = menuItems.filter(
                (item) =>
                  item.categoryId.toString() === category._id.toString(),
              );

              if (itemsInCategory.length === 0) return null;

              return (
                <section
                  key={category._id}
                  id={category._id.toString()}
                  className="scroll-mt-24 mb-12"
                >
                  {/* Título de la Categoría Estilizado */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                      {category.name}
                    </h2>
                    <div className="h-px bg-slate-200 flex-grow"></div>
                  </div>

                  {/* Grid de Platos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {itemsInCategory.map((item) => (
                      <article
                        key={item._id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex overflow-hidden group"
                      >
                        {/* Contenido de Texto */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                {item.name}
                              </h3>
                              {/* Precio destacado */}
                              <span className="text-lg font-black text-blue-600 shrink-0">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>

                            {item.description && (
                              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Footer de la tarjeta (Alérgenos o etiquetas) */}
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {item.allergens.map((allergen, idx) => (
                                <span
                                  key={idx}
                                  className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Imagen del Plato (Si existe) */}
                        {item.imageUrl && (
                          <div className="relative w-32 sm:w-40 shrink-0 bg-slate-100 overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={`Foto de ${item.name}`}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Pie de página */}
      <footer className="mt-20 text-center">
        <div className="inline-flex items-center justify-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
          <span className="text-xs text-slate-400 font-medium">
            Menú digital creado con
          </span>
          <span className="text-xs font-black text-slate-700">TuApp</span>
        </div>
      </footer>
      {/* NUESTRA NUEVA BARRA FLOTANTE */}
      <FloatingCategoryNav
        categories={populatedCategories.map((cat) => ({
          ...cat,
          _id: cat._id.toString(),
          restaurantId: cat.restaurantId.toString(), // Faltaba serializar esto
          createdAt: cat.createdAt ? cat.createdAt.toISOString() : null, // Y las fechas
          updatedAt: cat.updatedAt ? cat.updatedAt.toISOString() : null,
        }))}
      />
    </div>
  );
}
