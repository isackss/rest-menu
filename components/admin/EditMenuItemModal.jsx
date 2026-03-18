"use client";

import { useState } from "react";
import { updateMenuItem } from "@/actions/menuActions"; // Importamos la acción de actualizar

export default function EditMenuItemModal({ item, categories, onClose }) {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData) {
    setIsLoading(true);
    setMessage(null);

    // Llamamos al Server Action de actualización
    const result = await updateMenuItem(formData);

    setIsLoading(false);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result?.success) {
      // Si todo sale bien, cerramos el modal para volver a la tabla
      onClose();
    }
  }

  // Si no hay un item para editar, no renderizamos nada
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mt-10 mb-10 overflow-hidden relative">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            Editar: {item.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form action={onSubmit} className="p-6 space-y-5">
          {/* Inputs ocultos necesarios para el Server Action */}
          <input type="hidden" name="itemId" value={item._id} />
          <input type="hidden" name="restaurantId" value={item.restaurantId} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={item.name}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="categoryId"
                defaultValue={item.categoryId}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta ($) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                defaultValue={item.price}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Costo de Receta (Opcional)
              </label>
              <input
                type="number"
                name="costoInterno"
                step="0.01"
                defaultValue={item.costoInterno || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              rows="2"
              defaultValue={item.description}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="w-full md:w-2/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actualizar Foto (Opcional)
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Deja esto vacío para mantener la imagen actual.
              </p>
            </div>

            <div className="w-full md:w-auto flex items-center gap-3 mt-4 md:mt-0">
              <input
                type="checkbox"
                name="isAvailable"
                id="editIsAvailable"
                defaultChecked={item.isAvailable}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="editIsAvailable"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Plato Disponible
              </label>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
            >
              {message.text}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
