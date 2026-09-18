import { connectToDatabase } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { products as seedProducts, Product } from "@/lib/products";

function toStoreProduct(raw: any, index = 0): Product {
  const price = Number(raw.price ?? 0);
  const oldPrice = Number(raw.compareAtPrice ?? raw.oldPrice ?? price);
  const discount =
    oldPrice > price && oldPrice > 0
      ? `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`
      : "";

  return {
    id: Number(raw.id ?? index + 1),
    slug: String(raw.slug),
    sku: String(raw.sku),
    name: String(raw.name),
    category: String(raw.category),
    price,
    oldPrice,
    image: Array.isArray(raw.images) && raw.images[0] ? raw.images[0] : raw.image || "/images/ecovolt-logo.png",
    badge: raw.badge ?? discount,
    rating: Number(raw.rating ?? 5),
    reviews: Number(raw.reviews ?? 0),
    stock: typeof raw.stock === "boolean" ? raw.stock : Number(raw.stock ?? 0) > 0,
    description: String(raw.description ?? ""),
    specs: Array.isArray(raw.specs) ? raw.specs : [
      { label: "Brand", value: String(raw.brand || "EcoVolt") },
      { label: "SKU", value: String(raw.sku) },
      { label: "Availability", value: Number(raw.stock ?? 0) > 0 ? "In stock" : "Out of stock" },
    ],
  };
}

export async function getCatalogProducts(options?: { includeInactive?: boolean }): Promise<Product[]> {
  const db = await connectToDatabase();
  if (db) {
    const query = options?.includeInactive ? {} : { active: true };
    const rows = await ProductModel.find(query).sort({ featured: -1, createdAt: -1 }).lean();
    if (rows.length > 0) {
      return rows.map((row, index) => toStoreProduct(row, index));
    }
  }

  if (process.env.NODE_ENV === "production") {
    return [];
  }

  return seedProducts;
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await connectToDatabase();
  if (db) {
    const row = await ProductModel.findOne({ slug, active: true }).lean();
    if (row) return toStoreProduct(row);
  }

  if (process.env.NODE_ENV === "production") return undefined;
  return seedProducts.find((product) => product.slug === slug);
}

export async function getPurchasableProducts(slugs: string[]) {
  const unique = [...new Set(slugs)];
  const db = await connectToDatabase();

  if (db) {
    const rows = await ProductModel.find({
      slug: { $in: unique },
      active: true,
    }).lean();

    return new Map(
      rows.map((row) => [
        String(row.slug),
        {
          slug: String(row.slug),
          name: String(row.name),
          description: String(row.description ?? ""),
          price: Number(row.price),
          stock: Number(row.stock ?? 0),
        },
      ]),
    );
  }

  if (process.env.NODE_ENV === "production") return new Map();

  return new Map(
    seedProducts
      .filter((p) => unique.includes(p.slug))
      .map((p) => [
        p.slug,
        {
          slug: p.slug,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock ? Number.MAX_SAFE_INTEGER : 0,
        },
      ]),
  );
}
