import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      <section className="container py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product image */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <img
              src={product.image}
              alt={product.name}
              className="mx-auto aspect-square w-full max-w-lg object-contain"
            />
          </div>

          {/* Product information */}
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
              SKU: {product.sku}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="text-amber-400">
                {"★".repeat(product.rating)}
              </span>

              <span className="text-sm text-slate-500">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <strong className="text-3xl font-extrabold text-[#005b4f]">
                {formatPrice(product.price)}
              </strong>

              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>

              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                {product.badge}
              </span>
            </div>

            <p
              className={`mt-4 text-sm font-bold ${
                product.stock ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {product.stock ? "In Stock" : "Out of Stock"}
            </p>

            <p className="mt-6 text-sm leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-extrabold text-slate-900">
                Product Specifications
              </h2>

              <div className="mt-5">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-start justify-between gap-6 border-b border-slate-200 py-3 last:border-b-0"
                  >
                    <span className="text-sm text-slate-500">
                      {spec.label}
                    </span>

                    <span className="text-right text-sm font-semibold text-slate-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}