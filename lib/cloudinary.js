import { v2 as cloudinary } from "cloudinary";

// Configuramos Cloudinary con nuestras variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Función para subir un buffer de imagen a Cloudinary
 */
export async function uploadImageToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "menus-restaurantes" }, // Cloudinary creará esta carpeta automáticamente
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    // Ejecutamos la subida
    uploadStream.end(fileBuffer);
  });
}
