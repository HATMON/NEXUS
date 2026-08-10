"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { Product } from "@/lib/products";
import { ShoppingCart, Check, Zap, Minus, Plus } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const setQuantity = useCart((s) => s.setQuantity);
  const items = useCart((s) => s.items);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const existingInCart = items.find((i) => i.slug === product.slug);

  function handleAddToCart() {
    if (!product.stock) return;

    if (existingInCart) {
      setQuantity(product.slug, existingInCart.quantity + qty);
    } else {
      // Add multiple
      for (let i = 0; i < qty; i++) {
        addItem({ slug: product.slug, name: product.name, price: product.price });
      }
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!product.stock) return;
    if (!existingInCart) {
      for (let i = 0; i < qty; i++) {
        addItem({ slug: product.slug, name: product.name, price: product.price });
      }
    }
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      {/* Quantity Stepper */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quantity:
        </span>

        <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 overflow-hidden">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1 || !product.stock}
            className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:bg-slate-200 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="w-12 text-center text-sm font-black text-slate-900">
            {qty}
          </span>

          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            disabled={!product.stock}
            className="flex h-11 w-11 items-center justify-center text-slate-600 transition hover:bg-slate-200 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.stock}
          className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold text-white transition-all shadow-md active:scale-[0.99] ${
            added
              ? "bg-emerald-800 text-white"
              : product.stock
              ? "bg-[#005b4f] hover:bg-[#00483e] shadow-emerald-950/20"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" />
              <span>Added to Cart ✓</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!product.stock}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#ffc400] text-sm font-extrabold text-black transition hover:bg-yellow-400 active:scale-[0.99] shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <Zap className="h-5 w-5 fill-black text-black" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}

