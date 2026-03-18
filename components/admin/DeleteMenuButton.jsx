"use client";

import { useState } from "react";
import { deleteMenuItem } from "@/actions/menuActions";

export default function DeleteMenuButton({ itemId, itemName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Confirmación de seguridad nativa del navegador
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmacion) return; // Si cancela, no hacemos nada

    // 2. Ejecutar la eliminación
    setIsDeleting(true);
    const result = await deleteMenuItem(itemId);
    setIsDeleting(false);

    if (result?.error) {
      alert(result.error); // Mostramos un alert simple en caso de error
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 p-2 rounded-md transition-colors"
      title="Eliminar plato"
    >
      {isDeleting ? (
        <span className="text-xs font-bold">Borrando...</span>
      ) : (
        // Icono de Papelera en SVG
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      )}
    </button>
  );
}
