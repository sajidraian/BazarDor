
"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type ProductGridProps = {
  limit?: number;
  category?: string;
  trend?: "up" | "down";
  sortOrder?: "default" | "price-asc" | "price-desc";
};

function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="পণ্য লোড হচ্ছে">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
        >
          <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-gray-100">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
          </div>
          <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
          <div className="mb-3 h-6 w-1/2 rounded bg-gray-200" />
          <div className="h-9 w-full rounded-lg bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid({
  limit,
  category,
  trend,
  sortOrder = "default",
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await getProducts();

        if (active) {
          setProducts(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, [retry]);

  if (loading) {
    return <ProductSkeleton count={limit ?? 8} />;
  }

  if (error) {
    return (
      <div
        className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
        role="alert"
      >
        <p className="mb-3 text-red-700">{error}</p>

        <button
          type="button"
          onClick={() => setRetry((previous) => previous + 1)}
          className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  const filteredProducts = products
    .filter((product) => !category || product.category === category)
    .filter((product) => !trend || product.change.dir === trend)
    .sort((a, b) => {
      if (trend === "up") {
        return b.change.pct - a.change.pct;
      }

      if (trend === "down") {
        return a.change.pct - b.change.pct;
      }

      if (sortOrder === "price-asc") {
        return a.today - b.today;
      }

      if (sortOrder === "price-desc") {
        return b.today - a.today;
      }

      return 0;
    });

  const displayedProducts =
    limit !== undefined
      ? filteredProducts.slice(0, limit)
      : filteredProducts;

  if (displayedProducts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="mb-2 text-3xl">🔎</p>
        <p className="font-semibold text-gray-800">
          কোনো পণ্য পাওয়া যায়নি
        </p>
        <p className="mt-1 text-sm text-gray-500">
          অন্য ক্যাটাগরি বা সাজানোর পদ্ধতি চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {displayedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
