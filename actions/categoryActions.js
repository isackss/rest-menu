"use server";

import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
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

/**
 * Server Action para Actualizar una Categoría
 */
export async function updateCategory(formData) {
  try {
    await dbConnect();

    const categoryId = formData.get("categoryId");
    const name = formData.get("name");

    // Validación básica
    if (!categoryId) return { error: "ID de categoría no proporcionado." };
    if (!name || name.trim() === "")
      return { error: "El nombre de la categoría es obligatorio." };

    // Actualizamos el documento
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: name.trim() },
      { new: true }, // Devuelve el documento actualizado
    );

    if (!updatedCategory) {
      return { error: "La categoría no existe." };
    }

    // Refrescamos la caché del panel
    revalidatePath("/(admin)/menu-builder");

    return { success: true, message: "Categoría actualizada con éxito." };
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return { error: "Hubo un error al actualizar la base de datos." };
  }
}

/**
 * Server Action para Eliminar una Categoría de forma segura
 */
export async function deleteCategory(categoryId) {
  try {
    await dbConnect();

    // 1. Verificación de Seguridad: ¿Hay platos usando esta categoría?
    const itemsCount = await MenuItem.countDocuments({ categoryId });

    if (itemsCount > 0) {
      return {
        error: `No puedes eliminar esta categoría porque tiene ${itemsCount} plato(s) asociado(s). Por favor, elimina o mueve los platos primero.`,
      };
    }

    // 2. Si está vacía, procedemos a eliminarla
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return { error: "La categoría no fue encontrada." };
    }

    revalidatePath("/(admin)/menu-builder");

    return { success: true, message: "Categoría eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return { error: "Hubo un error al intentar eliminar la categoría." };
  }
}
