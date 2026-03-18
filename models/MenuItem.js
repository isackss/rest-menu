import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    costoInterno: { type: Number }, // Costo de receta (opcional, uso interno)
    imageUrl: { type: String }, // Aquí iría la URL de Cloudinary/S3
    isAvailable: { type: Boolean, default: true }, // Para ocultar platos agotados desde el móvil
    allergens: [{ type: String }], // Ej: ["Gluten", "Lácteos"]
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.MenuItem ||
  mongoose.model("MenuItem", MenuItemSchema);
