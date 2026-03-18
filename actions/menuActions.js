"use server";

import dbConnect from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { revalidatePath } from "next/cache";
import { uploadImageToCloudinary } from "@/lib/cloudinary"; // Importamos nuestra nueva función

export async function createMenuItem(formData) {
  try {
    await dbConnect();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const costoInterno = formData.get("costoInterno");
    const categoryId = formData.get("categoryId");
    const restaurantId = formData.get("restaurantId");
    const isAvailable =
      formData.get("isAvailable") === "on" ||
      formData.get("isAvailable") === "true";

    // 1. Extraemos el archivo de imagen del formulario
    const imageFile = formData.get("imageFile");
    let imageUrl = "";

    // 2. Si el usuario subió una imagen (y no está vacía)
    if (imageFile && imageFile.size > 0) {
      // Convertimos el archivo web a un Buffer de Node.js
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Subimos a Cloudinary y obtenemos la respuesta
      const uploadResult = await uploadImageToCloudinary(buffer);

      // Guardamos la URL segura que nos da Cloudinary
      imageUrl = uploadResult.secure_url;
    }

    // 3. Crear el documento en MongoDB (ahora con la URL real de Cloudinary)
    const newMenuItem = await MenuItem.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      price: parseFloat(price),
      costoInterno: costoInterno ? parseFloat(costoInterno) : null,
      categoryId,
      restaurantId,
      imageUrl: imageUrl, // Aquí asignamos la URL generada
      isAvailable,
    });

    revalidatePath("/(admin)/menu-builder");

    return { success: true, message: "Plato añadido correctamente al menú." };
  } catch (error) {
    console.error("Error al crear el plato:", error);
    return {
      error: "Hubo un problema al guardar el plato en la base de datos.",
    };
  }
}

/**
 * Server Action para Eliminar un Plato
 */
export async function deleteMenuItem(itemId) {
  try {
    await dbConnect();

    // Verificamos que el plato exista y lo eliminamos
    const deletedItem = await MenuItem.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return { error: "El plato no fue encontrado." };
    }

    // Refrescamos la interfaz
    revalidatePath("/(admin)/menu-builder");

    return { success: true, message: "Plato eliminado correctamente." };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { error: "Hubo un error al intentar eliminar el plato." };
  }
}

/**
 * Server Action para Actualizar un Plato
 */
export async function updateMenuItem(formData) {
  try {
    await dbConnect();

    const itemId = formData.get("itemId"); // Necesitamos saber qué plato editar
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const costoInterno = formData.get("costoInterno");
    const categoryId = formData.get("categoryId");
    const isAvailable =
      formData.get("isAvailable") === "on" ||
      formData.get("isAvailable") === "true";

    // Buscamos el plato original para no perder datos si no se envían
    const existingItem = await MenuItem.findById(itemId);
    if (!existingItem) return { error: "Plato no encontrado." };

    let imageUrl = existingItem.imageUrl; // Por defecto, conservamos la imagen anterior

    // Verificamos si el usuario subió una NUEVA imagen
    const imageFile = formData.get("imageFile");
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadImageToCloudinary(buffer);
      imageUrl = uploadResult.secure_url;
    }

    // Actualizamos el documento en MongoDB
    await MenuItem.findByIdAndUpdate(itemId, {
      name: name.trim(),
      description: description ? description.trim() : "",
      price: parseFloat(price),
      costoInterno: costoInterno ? parseFloat(costoInterno) : null,
      categoryId,
      imageUrl, // Tendrá la URL nueva o la vieja, dependiendo de lo que hizo el usuario
      isAvailable,
    });

    revalidatePath("/(admin)/menu-builder");

    return { success: true, message: "Plato actualizado con éxito." };
  } catch (error) {
    console.error("Error al actualizar:", error);
    return { error: "Hubo un error al actualizar el plato." };
  }
}
