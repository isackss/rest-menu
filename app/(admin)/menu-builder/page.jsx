import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";

// Componentes de creación
import CreateCategoryForm from "@/components/admin/CreateCategoryForm";
import CreateMenuItemForm from "@/components/admin/CreateMenuItemForm";

// Componentes de gestión (Tablas)
import CategoriesTable from "@/components/admin/CategoriesTable";
import MenuItemsTable from "@/components/admin/MenuItemsTable";

// Componente del QR
import QRCodeGenerator from "@/components/admin/QRCodeGenerator";

export const metadata = {
  title: "Constructor de Menú | Panel de Administración",
};

export default async function MenuBuilderPage() {
  await dbConnect();

  const restaurant = await Restaurant.findOne({}).lean();

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
      </div>
    );
  }

  const restaurantId = restaurant._id.toString();

  const rawCategories = await Category.find({ restaurantId: restaurant._id })
    .sort({ order: 1 })
    .lean();
  const rawMenuItems = await MenuItem.find({
    restaurantId: restaurant._id,
  }).lean();

  // Serialización para evitar el error de Next.js
  const serializedCategories = rawCategories.map((cat) => ({
    ...cat,
    _id: cat._id.toString(),
    restaurantId: cat.restaurantId.toString(),
    createdAt: cat.createdAt ? cat.createdAt.toISOString() : null,
    updatedAt: cat.updatedAt ? cat.updatedAt.toISOString() : null,
  }));

  const serializedMenuItems = rawMenuItems.map((item) => ({
    ...item,
    _id: item._id.toString(),
    categoryId: item.categoryId.toString(),
    restaurantId: item.restaurantId.toString(),
    createdAt: item.createdAt ? item.createdAt.toISOString() : null,
    updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <header className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Menú</h1>
        <p className="text-gray-500 mt-1">
          Editando el menú de:{" "}
          <span className="font-semibold text-blue-600">{restaurant.name}</span>
        </p>
      </header>

      {/* Grid principal: 2 columnas para contenido, 1 columna para el visualizador lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA (Principal): Formularios y Tablas */}
        <div className="lg:col-span-2 space-y-12">
          {/* Zona de Creación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

          {/* Zona de Tablas */}
          <div className="space-y-10 border-t border-gray-200 pt-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Listado de Categorías
              </h2>
              <CategoriesTable
                categories={serializedCategories}
                menuItems={serializedMenuItems}
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Listado de Platos
              </h2>
              <MenuItemsTable
                items={serializedMenuItems}
                categories={serializedCategories}
              />
            </section>
          </div>
        </div>

        {/* COLUMNA DERECHA (Lateral): Visualizador y QR */}
        <div className="space-y-8">
          {/* Tarjeta del Resumen en Vivo */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit sticky top-6">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Resumen en Vivo
            </h2>

            {serializedCategories.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-4">
                Aún no hay categorías en tu menú.
              </p>
            ) : (
              <ul className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {serializedCategories.map((cat) => {
                  const itemsCount = serializedMenuItems.filter(
                    (item) => item.categoryId === cat._id,
                  ).length;

                  return (
                    <li
                      key={cat._id}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <span className="font-semibold text-gray-700 text-sm">
                        {cat.name}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {itemsCount}
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
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                <span>📱</span> Ver menú público
              </a>
            </div>
          </div>

          {/* Tarjeta del Código QR */}
          <QRCodeGenerator slug={restaurant.slug} />
        </div>
      </div>
    </div>
  );
}
