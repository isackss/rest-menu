"use client";

import { useState } from "react";
import { createCategory } from "@/actions/categoryActions";

// Recibimos el restaurantId como prop desde la página padre
export default function CreateCategoryForm({ restaurantId }) {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData) {
    setIsLoading(true);
    setMessage(null);

    const result = await createCategory(formData);

    setIsLoading(false);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result?.success) {
      setMessage({ type: "success", text: result.message });
      // Limpiamos el input después de un éxito para que pueda escribir la siguiente categoría
      document.getElementById("category-form").reset();
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Añadir Nueva Categoría
      </h3>

      <form
        id="category-form"
        action={onSubmit}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Input oculto para pasar el ID del restaurante al Server Action de forma segura */}
        <input type="hidden" name="restaurantId" value={restaurantId} />

        <div className="flex-grow">
          <input
            type="text"
            name="name"
            required
            placeholder="Ej: Entrantes, Postres, Vinos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-800 hover:bg-black"
          }`}
        >
          {isLoading ? "Añadiendo..." : "Añadir"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
