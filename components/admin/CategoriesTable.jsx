"use client";

import { useState } from "react";
import EditCategoryModal from "@/components/admin/EditCategoryModal";
import { deleteCategory } from "@/actions/categoryActions";

export default function CategoriesTable({ categories, menuItems }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Función para manejar el borrado desde el cliente
  const handleDelete = async (categoryId, categoryName, itemsCount) => {
    // Si la validación visual falla, le avisamos antes de tocar el servidor
    if (itemsCount > 0) {
      alert(
        `⚠️ Acción denegada:\n\nLa categoría "${categoryName}" tiene ${itemsCount} platos dentro. Debes reasignar o eliminar esos platos antes de borrar la categoría.`,
      );
      return;
    }

    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar la categoría "${categoryName}"?`,
    );
    if (!confirmacion) return;

    setIsDeleting(true);
    const result = await deleteCategory(categoryId);
    setIsDeleting(false);

    if (result?.error) {
      alert(result.error);
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
        <p className="text-gray-500">Aún no hay categorías creadas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Nombre de la Categoría</th>
              <th className="px-6 py-4 text-center">Platos Asociados</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => {
              // Contamos cuántos platos pertenecen a esta categoría
              const itemsCount = menuItems.filter(
                (item) => item.categoryId === category._id,
              ).length;

              return (
                <tr
                  key={category._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Nombre */}
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {category.name}
                  </td>

                  {/* Contador de Platos */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        itemsCount > 0
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {itemsCount} {itemsCount === 1 ? "plato" : "platos"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Botón Editar */}
                      <button
                        onClick={() => setEditingCategory(category)}
                        disabled={isDeleting}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-md transition-colors bg-blue-50 hover:bg-blue-100"
                        title="Editar categoría"
                      >
                        <svg
                          className="w-4 h-4"
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

                      {/* Botón Eliminar */}
                      <button
                        onClick={() =>
                          handleDelete(category._id, category.name, itemsCount)
                        }
                        disabled={isDeleting}
                        className={`p-2 rounded-md transition-colors ${
                          itemsCount > 0
                            ? "text-gray-300 cursor-not-allowed" // Se ve desactivado si tiene platos
                            : "text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100"
                        }`}
                        title={
                          itemsCount > 0
                            ? "No se puede borrar porque tiene platos"
                            : "Eliminar categoría"
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Renderizamos el Modal si hay una categoría seleccionada */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}
