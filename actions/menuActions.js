"use server";

import dbConnect from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { revalidatePath } from "next/cache";

export async function createMenuItem(formData) {
  try {
    await dbConnect();

    // 1. Extraer los datos del formulario
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const costoInterno = formData.get("costoInterno");
    const categoryId = formData.get("categoryId");
    const restaurantId = formData.get("restaurantId");
    const imageUrl = formData.get("imageUrl"); // Por ahora una URL de texto

    // Los checkboxes en HTML envían 'on' si están marcados
    const isAvailable =
      formData.get("isAvailable") === "on" ||
      formData.get("isAvailable") === "true";

    // 2. Validaciones básicas
    if (!name || name.trim() === "")
      return { error: "El nombre del plato es obligatorio." };
    if (!price || isNaN(price))
      return { error: "El precio debe ser un número válido." };
    if (!categoryId) return { error: "Debes seleccionar una categoría." };
    if (!restaurantId) return { error: "Falta el ID del restaurante." };

    // 3. Crear el documento en MongoDB
    const newMenuItem = await MenuItem.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      price: parseFloat(price),
      // Incluimos el costo interno. Esto es ideal para luego cruzar datos y calcular
      // el escandallo de cocina y los márgenes de beneficio en el panel de administración.
      costoInterno: costoInterno ? parseFloat(costoInterno) : null,
      categoryId,
      restaurantId,
      imageUrl: imageUrl ? imageUrl.trim() : "",
      isAvailable,
    });

    // 4. Refrescar la caché de la página donde se arma el menú
    revalidatePath("/(admin)/menu-builder");

    return { success: true, message: "Plato añadido correctamente al menú." };
  } catch (error) {
    console.error("Error al crear el plato:", error);
    return {
      error: "Hubo un problema al guardar el plato en la base de datos.",
    };
  }
}
