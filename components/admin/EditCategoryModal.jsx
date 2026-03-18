"use client";

import { useState } from "react";
import { updateCategory } from "@/actions/categoryActions";

export default function EditCategoryModal({ category, onClose }) {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData) {
    setIsLoading(true);
    setMessage(null);

    const result = await updateCategory(formData);

    setIsLoading(false);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result?.success) {
      // Cerramos el modal inmediatamente si tuvo éxito
      onClose();
    }
  }

  // Prevención de errores si no llega la categoría
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Caja del Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Cabecera */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Editar Categoría</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form action={onSubmit} className="p-6 space-y-4">
          <input type="hidden" name="categoryId" value={category._id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Categoría *
            </label>
            <input
              type="text"
              name="name"
              defaultValue={category.name}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Postres"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
            >
              {message.text}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2 text-sm text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-sm text-white font-medium rounded-lg transition-colors ${
                isLoading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
