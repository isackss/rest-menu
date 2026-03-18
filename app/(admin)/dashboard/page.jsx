import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | Panel de Administración",
};

export default async function DashboardPage() {
  await dbConnect();

  // 1. Obtenemos el restaurante activo (igual que hicimos en el menú builder)
  const restaurant = await Restaurant.findOne({}).lean();

  if (!restaurant) {
    return (
      <div className="p-8 text-center mt-10">
        <h2 className="text-2xl font-bold">Bienvenido</h2>
        <p className="text-gray-500 mt-2">
          Configura tu restaurante para ver las métricas.
        </p>
      </div>
    );
  }

  // 2. Traemos todos los platos y categorías de este restaurante
  const menuItems = await MenuItem.find({
    restaurantId: restaurant._id,
  }).lean();
  const categories = await Category.find({
    restaurantId: restaurant._id,
  }).lean();

  // 3. --- CÁLCULO DE MÉTRICAS ---
  const totalItems = menuItems.length;
  const totalCategories = categories.length;

  // Platos que el dueño marcó como "Agotado" (isAvailable: false)
  const outOfStockItems = menuItems.filter((item) => !item.isAvailable).length;
  const outOfStockPercentage =
    totalItems > 0 ? ((outOfStockItems / totalItems) * 100).toFixed(0) : 0;

  // Lógica de Escandallos: Calcular el margen de ganancia promedio
  let totalMarginPercentage = 0;
  let itemsWithCost = 0;

  menuItems.forEach((item) => {
    // Solo calculamos si el plato tiene un costo interno registrado y es mayor a cero
    if (item.costoInterno && item.costoInterno > 0 && item.price > 0) {
      const profitMargin = item.price - item.costoInterno;
      const marginPercent = (profitMargin / item.price) * 100;
      totalMarginPercentage += marginPercent;
      itemsWithCost++;
    }
  });

  const averageMargin =
    itemsWithCost > 0
      ? (totalMarginPercentage / itemsWithCost).toFixed(1)
      : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabecera de Bienvenida */}
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Hola, {restaurant.name} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Aquí tienes un resumen del rendimiento de tu menú hoy.
        </p>
      </header>

      {/* Grid de Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Tarjeta 1: Total de Platos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total en Menú</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {totalItems}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">🍔</div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Distribuidos en {totalCategories} categorías
          </p>
        </div>

        {/* Tarjeta 2: Platos Agotados */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Agotados</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {outOfStockItems}
              </h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">⚠️</div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-red-500 h-1.5 rounded-full"
                style={{ width: `${outOfStockPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {outOfStockPercentage}%
            </span>
          </div>
        </div>

        {/* Tarjeta 3: Margen de Ganancia (Escandallo) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Margen Promedio
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {averageMargin ? `${averageMargin}%` : "--"}
              </h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">💰</div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            {itemsWithCost > 0
              ? `Calculado sobre ${itemsWithCost} platos con costo.`
              : "Añade el costo de receta a tus platos."}
          </p>
        </div>

        {/* Tarjeta 4: Acceso Rápido */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-300">Tu Menú Público</p>
            <h3 className="text-lg font-bold mt-1 leading-snug">
              Listo para recibir clientes
            </h3>
          </div>
          <div className="relative z-10 mt-4">
            <Link
              href={`/${restaurant.slug}`}
              target="_blank"
              className="inline-block bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
            >
              Ver Menú QR ↗
            </Link>
          </div>
          {/* Decoración de fondo */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Sección Inferior: Alertas o Sugerencias */}
      {outOfStockItems > 0 && (
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
          <span className="text-orange-500 mt-0.5">🔔</span>
          <div>
            <h4 className="text-sm font-bold text-orange-800">
              Tienes platos desactivados
            </h4>
            <p className="text-sm text-orange-600 mt-1">
              Hay {outOfStockItems}{" "}
              {outOfStockItems === 1
                ? "plato que no se está"
                : "platos que no se están"}{" "}
              mostrando en tu menú público. Recuerda activarlos en el Editor de
              Menú cuando vuelvas a tener inventario.
            </p>
            <Link
              href="/menu-builder"
              className="text-sm font-bold text-orange-700 hover:underline mt-2 inline-block"
            >
              Ir al Editor →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
