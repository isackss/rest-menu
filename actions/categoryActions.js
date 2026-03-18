"use server";

import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function createCategory(formData) {
  try {
    await dbConnect();

    // Extraemos los datos enviados desde el formulario
    const name = formData.get("name");
    const restaurantId = formData.get("restaurantId");

    // Validación básica
    if (!name || name.trim() === "") {
      return { error: "El nombre de la categoría es obligatorio." };
    }

    if (!restaurantId) {
      return { error: "Falta el ID del restaurante." };
    }

    // Opcional: Podríamos contar cuántas categorías tiene ya este restaurante
    // para asignarle un número de "orden" automático y que el cliente pueda reordenarlas luego.
    const count = await Category.countDocuments({ restaurantId });

    // Guardar en MongoDB
    const newCategory = await Category.create({
      name: name.trim(),
      restaurantId,
      order: count, // Si es la primera, será 0, luego 1, 2, etc.
    });

    // Refrescamos la página donde el dueño edita su menú para que aparezca al instante
    revalidatePath("/(admin)/menu-builder");

    return { success: true, message: "Categoría añadida correctamente." };
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return { error: "Hubo un problema al guardar la categoría." };
  }
}
