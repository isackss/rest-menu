"use client";

import { useState } from "react";
import DeleteMenuButton from "@/components/admin/DeleteMenuButton";
import EditMenuItemModal from "@/components/admin/EditMenuItemModal";

// Recibimos los platos y las categorías desde la página principal
export default function MenuItemsTable({ items, categories }) {
  // Estado preparado para cuando construyamos el Modal de Edición
  const [editingItem, setEditingItem] = useState(null);

  // Función auxiliar para buscar el nombre de la categoría por su ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Sin categoría";
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
        <p className="text-gray-500">
          Aún no has añadido ningún plato a tu menú.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Plato</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Finanzas</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => {
              // Cálculos de rentabilidad (si existe el costo interno)
              const hasCost = item.costoInterno > 0;
              const marginValue = hasCost
                ? item.price - item.costoInterno
                : null;
              const marginPercentage = hasCost
                ? ((marginValue / item.price) * 100).toFixed(0)
                : null;

              return (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Columna: Foto y Nombre */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p
                          className="text-xs text-gray-500 truncate max-w-[150px]"
                          title={item.description}
                        >
                          {item.description || "Sin descripción"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Columna: Categoría */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {getCategoryName(item.categoryId)}
                    </span>
                  </td>

                  {/* Columna: Finanzas (Precio, Costo y Margen) */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        Venta: ${item.price.toFixed(2)}
                      </span>
                      {hasCost ? (
                        <>
                          <span className="text-xs text-gray-500">
                            Costo: ${item.costoInterno.toFixed(2)}
                          </span>
                          <span
                            className={`text-xs font-semibold mt-0.5 ${marginPercentage > 50 ? "text-green-600" : "text-orange-500"}`}
                          >
                            Margen: ${marginValue.toFixed(2)} (
                            {marginPercentage}%)
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          Sin escandallo
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Columna: Estado (Disponible / Agotado) */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.isAvailable
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${item.isAvailable ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                      {item.isAvailable ? "Disponible" : "Agotado"}
                    </span>
                  </td>

                  {/* Columna: Acciones (Editar y Eliminar) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingItem(item)} // Aquí abriremos el modal de edición
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-md transition-colors bg-blue-50 hover:bg-blue-100"
                        title="Editar plato"
                      >
                        {/* Icono de Lápiz */}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      {/* Nuestro componente de botón de eliminar previamente creado */}
                      <DeleteMenuButton
                        itemId={item._id}
                        itemName={item.name}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Renderizamos el modal condicionalmente si hay un plato en estado de edición */}
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)} // Al cerrar, limpiamos el estado
        />
      )}
    </div>
  );
}
