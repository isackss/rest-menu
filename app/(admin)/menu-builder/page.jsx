import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";

// Importamos nuestros Client Components (formularios)
import CreateCategoryForm from "@/components/admin/CreateCategoryForm";
import CreateMenuItemForm from "@/components/admin/CreateMenuItemForm";
import CreateRestaurantForm from "@/components/admin/CreateRestaurantForm";
import QRCodeGenerator from "@/components/admin/QRCodeGenerator";

export const metadata = {
  title: "Constructor de Menú | Panel de Administración",
};

export default async function MenuBuilderPage() {
  // 1. Conectar a la base de datos
  await dbConnect();

  // 2. Obtener el restaurante activo
  // NOTA: En producción, aquí buscarías el restaurante asociado al usuario logueado.
  // Por ahora, tomamos el primer restaurante que exista en la BD para poder probar la UI.
  const restaurant = await Restaurant.findOne({});

  // Si no hay restaurante, mostramos un mensaje amistoso
  if (!restaurant) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white text-center rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ¡Bienvenido a tu Panel!
        </h2>
        <p className="text-gray-600 mb-6">
          Para empezar a armar tu menú, primero debes registrar los datos de tu
          restaurante.
        </p>
        {/* Aquí podrías importar y mostrar el <CreateRestaurantForm /> que hicimos al principio */}
        <CreateRestaurantForm />
      </div>
    );
  }

  const restaurantId = restaurant._id.toString();

  // 3. Obtener las categorías de este restaurante
  // Usamos .lean() para que Mongoose devuelva objetos JavaScript puros,
  // necesarios para pasarlos a los Client Components en Next.js
  const categories = await Category.find({ restaurantId })
    .sort({ order: 1 })
    .lean();

  // Serializamos los IDs de MongoDB (que son objetos) a strings simples
  const serializedCategories = categories.map((cat) => ({
    ...cat,
    _id: cat._id.toString(),
    restaurantId: cat.restaurantId.toString(),
  }));

  // 4. (Opcional) Obtener los platos para contarlos en el resumen
  const menuItems = await MenuItem.find({ restaurantId }).lean();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Cabecera del Dashboard */}
      <header className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Menú</h1>
        <p className="text-gray-500 mt-1">
          Editando el menú de:{" "}
          <span className="font-semibold text-blue-600">{restaurant.name}</span>
        </p>
      </header>

      {/* Layout Principal: Dos columnas en pantallas grandes, una en móviles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda (Principal): Zona de Formularios */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Crea tus Categorías
              </h2>
            </div>
            <CreateCategoryForm restaurantId={restaurantId} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Añade tus Platos
              </h2>
            </div>
            <CreateMenuItemForm
              restaurantId={restaurantId}
              categories={serializedCategories}
            />
          </section>
        </div>

        {/* Columna Derecha (Lateral): Resumen Visual */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit sticky top-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            Resumen en Vivo
          </h2>

          {serializedCategories.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-4">
              Aún no hay categorías en tu menú.
            </p>
          ) : (
            <ul className="space-y-4">
              {serializedCategories.map((cat) => {
                // Contamos cuántos platos tiene esta categoría específica
                const itemsCount = menuItems.filter(
                  (item) => item.categoryId.toString() === cat._id,
                ).length;

                return (
                  <li
                    key={cat._id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                  >
                    <span className="font-semibold text-gray-700">
                      {cat.name}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {itemsCount} {itemsCount === 1 ? "plato" : "platos"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href={`/${restaurant.slug}`}
              target="_blank"
              className="block w-full text-center py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors"
            >
              Ver menú público
            </a>
          </div>
          <div className="mt-10">
            <QRCodeGenerator slug={restaurant.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
