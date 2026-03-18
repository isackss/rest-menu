"use client"; // 💻 Obligatorio porque usamos 'useState' y manejamos eventos del navegador

import { useState } from "react";
import { createRestaurant } from "@/actions/restaurantActions"; // Importamos tu Server Action

export default function CreateRestaurantForm() {
  // Estados para manejar el feedback visual al usuario
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función que intercepta el envío del formulario
  async function onSubmit(formData) {
    setIsLoading(true);
    setMessage(null); // Limpiamos mensajes anteriores

    // Llamamos al Server Action directamente
    const result = await createRestaurant(formData);

    setIsLoading(false);

    // Evaluamos la respuesta que nos devolvió el servidor
    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result?.success) {
      setMessage({
        type: "success",
        text: `¡Restaurante creado con éxito! Tu enlace es: /${result.slug}`,
      });
      // Opcional: Aquí podrías redirigir al usuario al dashboard usando useRouter()
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Nuevo Restaurante
      </h2>

      {/* Usamos la propiedad 'action' nativa de React 19 / Next.js */}
      <form action={onSubmit} className="space-y-4">
        {/* Campo: Nombre del Restaurante */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre del Restaurante *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Ej: La Pizzería de Juan"
          />
        </div>

        {/* Campo: Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción (Opcional)
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Breve descripción de tu especialidad..."
          ></textarea>
        </div>

        {/* Mensajes de feedback (Éxito o Error) */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Botón de Guardar */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Guardando..." : "Crear Restaurante"}
        </button>
      </form>
    </div>
  );
}
