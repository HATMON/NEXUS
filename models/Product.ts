import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    sku: { type: String, required: true, unique: true, index: true, trim: true },
    description: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "", trim: true },
    category: { type: String, required: true, index: true, trim: true },
    brand: { type: String, default: "", trim: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockLevel: { type: Number, default: 5, min: 0 },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export type ProductDocument = InferSchemaType<typeof productSchema>;

const Product: Model<ProductDocument> =
  mongoose.models.Product
    ? (mongoose.models.Product as Model<ProductDocument>)
    : mongoose.model<ProductDocument>("Product", productSchema);

export default Product;
