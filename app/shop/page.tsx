import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

type ShopPageProps = {
  searchParams?: {
    category?: string;
    search?: string;
    sort?: string;
  };
};

export default function ShopPage({ searchParams }: ShopPageProps) {
  const selectedCategory = searchParams?.category ?? "All Products";
  const searchTerm = searchParams?.search?.trim().toLowerCase() ?? "";
  const sortOption = searchParams?.sort ?? "featured";

  const categories = [
    "All Products",
    "Solar Panels",
    "Inverters",
    "Lithium Batteries",
    "Solar Kits",
  ];

  let filteredProducts =
    selectedCategory === "All Products"
      ? [...products]
      : products.filter(
          (product) => product.category === selectedCategory,
        );

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) => {
      const searchableText = [
        product.name,
        product.category,
        product.sku,
        product.description,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  if (sortOption === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortOption === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sortOption === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  if (sortOption === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="container">
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Shop Solar Products
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Browse solar panels, inverters, batteries, complete kits and other
            solar products for homes, businesses and institutions.
          </p>

          <form
            action="/shop"
            method="GET"
            className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_220px_200px_auto]"
          >
            <input
              type="search"
              name="search"
              defaultValue={searchParams?.search ?? ""}
              placeholder="Search products, category or SKU..."
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-500"
            />

            <select
              name="category"
              defaultValue={selectedCategory}
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sortOption}
              className="h-12 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
              <option value="name">Name: A to Z</option>
            </select>

            <button
              type="submit"
              className="h-12 rounded-xl bg-[#005b4f] px-6 text-sm font-extrabold text-white transition hover:bg-[#00483e]"
            >
              Apply
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => {
              const href =
                category === "All Products"
                  ? "/shop"
                  : `/shop?category=${encodeURIComponent(category)}`;

              return (
                <a
                  key={category}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    selectedCategory === category && !searchTerm
                      ? "bg-[#005b4f] text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                  }`}
                >
                  {category}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {searchTerm
                ? `Search results for “${searchParams?.search}”`
                : selectedCategory}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"} found
            </p>
          </div>

          {(searchTerm ||
            selectedCategory !== "All Products" ||
            sortOption !== "featured") && (
            <a
              href="/shop"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
            >
              Clear all filters
            </a>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-extrabold text-slate-900">
              No products found
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Try another search term, category or sorting option.
            </p>

            <a
              href="/shop"
              className="mt-6 inline-block rounded-xl bg-[#005b4f] px-6 py-3 text-sm font-bold text-white"
            >
              View All Products
            </a>
          </div>
        )}
      </section>
    </div>
  );
}