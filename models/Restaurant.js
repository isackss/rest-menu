import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Ej: "mi-restaurante" para la URL
    description: { type: String },
    logoUrl: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Previene la sobreescritura del modelo en Next.js durante el desarrollo
export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", RestaurantSchema);
