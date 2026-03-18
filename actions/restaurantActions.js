"use server"; // ⚡ Esta directiva es obligatoria al inicio del archivo para indicar que todo aquí corre en el servidor

import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";
import { revalidatePath } from "next/cache";

/**
 * Función auxiliar para generar un slug único.
 * Si "La Pizzería" ya existe (la-pizzeria), el siguiente será "la-pizzeria-1"
 */
async function generateUniqueSlug(name) {
  // 1. Limpiar el nombre: a minúsculas, quitar acentos y cambiar espacios por guiones
  let baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Quita acentos
    .trim()
    .replace(/[\s\W-]+/g, "-") // Reemplaza espacios y caracteres raros por guiones
    .replace(/^-+|-+$/g, ""); // Quita guiones al principio o al final

  let slug = baseSlug;
  let counter = 1;

  // 2. Verificar en la base de datos si ya existe para evitar colisiones
  while (await Restaurant.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Server Action principal para crear el restaurante
 */
export async function createRestaurant(formData) {
  try {
    // Siempre asegurar la conexión antes de cualquier consulta
    await dbConnect();

    // Extraer los datos del FormData (que vendrá del formulario del cliente)
    const name = formData.get("name");
    const description = formData.get("description");
    // Aquí puedes extraer más campos como address, contactNumber, etc.

    // Validación básica en el servidor
    if (!name || name.trim() === "") {
      return { error: "El nombre del restaurante es obligatorio." };
    }

    // Generar el slug único
    const slug = await generateUniqueSlug(name);

    // Crear el documento en MongoDB
    const newRestaurant = await Restaurant.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : "",
    });

    // 🔄 Refrescar la caché de la página del dashboard para que el nuevo restaurante aparezca inmediatamente
    revalidatePath("/dashboard");

    // Devolver una respuesta exitosa.
    // Nota: Devolvemos datos primitivos (strings/booleanos) porque los objetos complejos de Mongoose no se pueden pasar de servidor a cliente directamente.
    return {
      success: true,
      restaurantId: newRestaurant._id.toString(),
      slug: newRestaurant.slug,
    };
  } catch (error) {
    console.error("Error al crear el restaurante:", error);
    return {
      error: "Hubo un error interno al crear el restaurante. Intenta de nuevo.",
    };
  }
}
