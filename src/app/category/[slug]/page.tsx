
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import ProductGrid from "@/components/ProductGrid";

type Category = {
  id: number | string;
  slug: string;
  nameBn: string;
  icon: string;
};

const API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchCategories(): Promise<Category[]> {
  let lastError: unknown;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}/categories`);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const result: unknown = await response.json();

      const categories = Array.isArray(result)
        ? result
        : typeof result === "object" && result !== null
          ? (
              (result as { categories?: unknown }).categories ??
              (result as { data?: unknown }).data
            )
          : [];

      if (Array.isArray(categories)) {
        return categories as Category[];
      }

      throw new Error("Invalid categories response");
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Unable to load categories");
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "default" | "price-asc" | "price-desc"
  >("default");

  useEffect(() => {
    let active = true;

    async function loadCategory() {
      try {
        setLoading(true);
        setError("");

        const categories = await fetchCategories();
        const selectedCategory = categories.find(
          (item) => item.slug === slug
        );

        if (!active) return;

        if (!selectedCategory) {
          setCategory(null);
          setError("এই ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।");
          return;
        }

        setCategory(selectedCategory);
      } catch {
        if (active) {
          setError(
            "ক্যাটাগরির তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <PriceTicker />

      <section className="container-main py-8 md:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-sm text-gray-500"
        >
          <a href="/" className="hover:text-green-700">
            হোম
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-800">
            ক্যাটাগরি
          </span>
          {category && (
            <>
              <span className="mx-2">/</span>
              <span className="text-green-700">
                {category.nameBn}
              </span>
            </>
          )}
        </nav>

        {loading ? (
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-56 rounded bg-gray-200" />
            <div className="mb-8 h-4 w-72 max-w-full rounded bg-gray-200" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-4"
                >
                  <div className="mb-4 h-28 rounded-xl bg-gray-200" />
                  <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-5 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <p className="mb-4 text-4xl">🔎</p>
            <h1 className="mb-2 text-xl font-bold text-gray-900">
              {error}
            </h1>
            <p className="mb-6 text-sm text-gray-500">
              ক্যাটাগরির লিংকটি যাচাই করুন অথবা হোমপেজে ফিরে যান।
            </p>
            <a
              href="/"
              className="inline-flex rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              হোমপেজে ফিরে যান
            </a>
          </div>
        ) : category ? (
          <>
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-4xl" aria-hidden="true">
                    {category.icon}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {category.nameBn}
                  </h1>
                </div>

                <p className="text-sm text-gray-500 md:text-base">
                  {category.nameBn} ক্যাটাগরির বাজারদর দেখুন।
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:min-w-56">
                <label
                  htmlFor="price-sort"
                  className="text-sm font-medium text-gray-700"
                >
                  পণ্য সাজান
                </label>

                <select
                  id="price-sort"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(
                      event.target.value as
                        | "default"
                        | "price-asc"
                        | "price-desc"
                    )
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="default">
                    ডিফল্ট ক্রম
                  </option>
                  <option value="price-asc">
                    দাম: কম থেকে বেশি
                  </option>
                  <option value="price-desc">
                    দাম: বেশি থেকে কম
                  </option>
                </select>
              </div>
            </div>

            <ProductGrid
              category={category.slug}
              sortOrder={sortOrder}
            />
          </>
        ) : null}
      </section>

     
    </main>
  );
}
