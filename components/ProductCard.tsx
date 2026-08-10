"use client";

import { useState } from "react";
import { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { ShoppingCart, Check, Heart, Star } from "lucide-react";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const addItem = useCart((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!product.stock) return;

    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  }

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl h-full">
      <a href={`/product/${product.slug}`} className="flex flex-col flex-1">
        {/* Product Image & Badges */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-4 sm:p-5 flex items-center justify-center">
          {product.badge && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-red-600 px-2 py-0.5 text-[10px] sm:text-xs font-black text-white shadow-sm">
              {product.badge}
            </span>
          )}

          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={toggleWishlist}
            className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-slate-400 shadow transition hover:bg-white hover:text-red-500"
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>

          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Details Container */}
        <div className="flex flex-col flex-1 p-3.5 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            {product.category}
          </p>

          <h3 className="mt-1 text-xs sm:text-sm font-extrabold leading-snug text-slate-900 line-clamp-2 min-h-[2.4rem] group-hover:text-emerald-700 transition">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    i < product.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 fill-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <strong className="text-sm sm:text-base lg:text-lg font-black text-[#00483e]">
              {formatPrice(product.price)}
            </strong>

            {product.oldPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                product.stock ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-[10px] sm:text-xs font-bold ${
                product.stock ? "text-emerald-700" : "text-red-500"
              }`}
            >
              {product.stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </a>

      {/* Action Button */}
      <div className="p-3.5 sm:p-4 pt-0">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.stock}
          className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-extrabold text-white transition-all shadow-md active:scale-[0.98] ${
            added
              ? "bg-emerald-800 text-white"
              : product.stock
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/20"
              : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              <span>Added to Cart ✓</span>
            </>
          ) : product.stock ? (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </>
          ) : (
            <span>Unavailable</span>
          )}
        </button>
      </div>
    </article>
  );
}
