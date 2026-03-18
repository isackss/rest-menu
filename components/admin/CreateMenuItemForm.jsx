"use client";

import { useState } from "react";
import { createMenuItem } from "@/actions/menuActions";

// Recibimos el ID del restaurante y el array de categorías ya cargadas desde la BD
export default function CreateMenuItemForm({ restaurantId, categories }) {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData) {
    setIsLoading(true);
    setMessage(null);

    const result = await createMenuItem(formData);

    setIsLoading(false);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result?.success) {
      setMessage({ type: "success", text: result.message });
      // Limpiamos el formulario tras añadir el plato
      document.getElementById("menu-item-form").reset();
    }
  }

  // Si el restaurante aún no tiene categorías creadas, le avisamos al usuario
  if (!categories || categories.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
        Debes crear al menos una categoría antes de poder añadir platos al menú.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Añadir Nuevo Plato
      </h3>

      <form id="menu-item-form" action={onSubmit} className="space-y-5">
        <input type="hidden" name="restaurantId" value={restaurantId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nombre del Plato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej: Hamburguesa Clásica"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Selector de Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              name="categoryId"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Selecciona una categoría...</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Precio de Venta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio de Venta ($) *
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Costo Interno (Escandallo) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo de Receta (Opcional)
            </label>
            <input
              type="number"
              name="costoInterno"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Útil para digitalizar el escandallo de cocina y calcular márgenes.
              No visible al cliente.
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            rows="2"
            placeholder="Ingredientes principales..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        {/* Subida de Imagen y Disponibilidad */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto del Plato (Opcional)
            </label>
            <input
              type="file"
              name="imageFile" // Debe coincidir con formData.get('imageFile') en el Server Action
              accept="image/*" // Solo permite seleccionar imágenes
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
            />
          </div>

          {/* Checkbox de Disponibilidad */}
          <div className="w-full md:w-auto flex items-center gap-3 mt-4 md:mt-0">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              defaultChecked
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="isAvailable"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Plato Disponible
            </label>
          </div>
        </div>

        {/* Mensajes de feedback */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Guardando..." : "Guardar Plato"}
        </button>
      </form>
    </div>
  );
}
