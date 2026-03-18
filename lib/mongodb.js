import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable de entorno MONGODB_URI dentro de .env.local');
}

/**
 * Usamos una variable global para mantener la conexión a la base de datos
 * en caché a través de los reinicios del servidor en desarrollo (Hot Reloading).
 * Esto evita agotar el límite de conexiones de MongoDB.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Si ya tenemos una conexión activa, la retornamos y no creamos una nueva
  if (cached.conn) {
    return cached.conn;
  }

  // Si no hay una conexión en proceso, la iniciamos
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Desactiva el buffering de Mongoose para fallar rápido si no hay conexión
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Conectado a MongoDB');
      return mongoose;
    });
  }

  try {
    // Esperamos a que la promesa de conexión se resuelva
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;