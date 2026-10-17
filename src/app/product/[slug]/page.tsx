
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

function formatBengaliPrice(price: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(price);
}

function formatChange(value: number) {
  const formatted = formatBengaliPrice(Math.abs(value));
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatted}%`;
}

function PriceSummary({
  label,
  price,
  description,
  colorClass = "text-gray-900",
}: {
  label: string;
  price: number;
  description: string;
  colorClass?: string;
}) {
  return (
    <div className="rounded-xl border border-[#e3ebe4] bg-white p-5 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-2 text-xl font-extrabold ${colorClass}`}>
        ৳{formatBengaliPrice(price)}
      </p>
      <p className="mt-1 text-[11px] text-gray-400">{description}</p>
    </div>
  );
}

function PriceHistory({
  label,
  price,
}: {
  label: string;
  price: number;
}) {
  return (
    <div className="rounded-xl border border-[#e3ebe4] bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-gray-900">
        ৳{formatBengaliPrice(price)}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-64 rounded bg-gray-200" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-72 rounded-2xl bg-gray-200" />
        <div className="h-72 rounded-2xl bg-gray-200" />
      </div>

      <div className="h-48 rounded-2xl bg-gray-200" />
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const { data: session, isPending: sessionPending } = useSession();

  const notified = useRef(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (sessionPending) return;

    if (!session) {
      if (!notified.current) {
        notified.current = true;
        toast.error("পণ্যের বিস্তারিত দেখতে আগে Sign In করো।");
      }

      router.replace("/sign-in");
      return;
    }

    notified.current = false;
  }, [session, sessionPending, router]);

  useEffect(() => {
    if (sessionPending || !session) {
      setLoading(true);
      return;
    }

    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const products = await getProducts();
        const found = products.find((item) => item.slug === slug);

        if (!active) return;

        if (!found) {
          setError("এই পণ্যটি খুঁজে পাওয়া যায়নি।");
          return;
        }

        setProduct(found);
      } catch {
        if (active) {
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      active = false;
    };
  }, [slug, session, sessionPending, retry]);

  const markets = product?.markets ?? [];

  const validMarkets = markets
    .map((market) => ({
      ...market,
      min: Number(market.min),
      max: Number(market.max),
    }))
    .filter(
      (market) =>
        Number.isFinite(market.min) &&
        Number.isFinite(market.max) &&
        market.min >= 0 &&
        market.max >= market.min
    );

  const minPrice =
    validMarkets.length > 0
      ? Math.min(...validMarkets.map((market) => market.min))
      : product?.today ?? 0;

  const maxPrice =
    validMarkets.length > 0
      ? Math.max(...validMarkets.map((market) => market.max))
      : product?.today ?? 0;

  const averagePrice =
    validMarkets.length > 0
      ? validMarkets.reduce(
          (total, market) => total + (market.min + market.max) / 2,
          0
        ) / validMarkets.length
      : product?.today ?? 0;

  if (sessionPending || !session) {
    return (
      <main className="container-main min-h-screen py-12">
        <div className="mx-auto max-w-4xl">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      <Navbar />
      <PriceTicker />

      <div className="container-main max-w-5xl py-8 md:py-12">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-[#21875a] hover:underline"
        >
          ← হোমপেজে ফিরে যান
        </Link>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div
            className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm"
            role="alert"
          >
            <p className="mb-3 text-4xl" aria-hidden="true">
              🔎
            </p>

            <h1 className="text-xl font-bold text-gray-900">
              {error}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setRetry((previous) => previous + 1)}
                className="rounded-xl bg-[#21875a] px-5 py-3 font-semibold text-white transition hover:bg-[#176b45]"
              >
                আবার চেষ্টা করুন
              </button>

              <Link
                href="/"
                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                হোমপেজে ফিরে যান
              </Link>
            </div>
          </div>
        ) : product ? (
          <>
      
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm"
            >
              <Link href="/" className="hover:text-[#21875a]">
                হোম
              </Link>

              <span>/</span>

              <Link
                href={`/category/${product.category}`}
                className="hover:text-[#21875a]"
              >
                {product.categoryNameBn || product.category}
              </Link>

              <span>/</span>

              <span className="font-medium text-gray-800">
                {product.nameBn}
              </span>
            </nav>

           
            <section className="mb-8 flex flex-col justify-between gap-6 rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
              <div className="flex items-start gap-4 sm:items-center sm:gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f0f7f1] text-4xl sm:h-20 sm:w-20 sm:text-5xl">
                  {product.image || product.categoryIcon || "🛒"}
                </div>

                <div>
                  <h1 className="text-2xl font-black text-[#233527] sm:text-3xl">
                    {product.nameBn}
                  </h1>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    প্রতি {product.unit} - {product.categoryNameBn}
                  </p>

                  <p className="mt-2 text-xs font-medium text-gray-600 sm:text-sm">
                    গতকালকের তুলনায় আজ দাম{" "}
                    <span
                      className={
                        product.change.dir === "up"
                          ? "font-bold text-[#21875a]"
                          : product.change.dir === "down"
                            ? "font-bold text-[#d94a42]"
                            : "font-bold text-gray-600"
                      }
                    >
                      {product.change.dir === "up"
                        ? "বেড়েছে"
                        : product.change.dir === "down"
                          ? "কমেছে"
                          : "অপরিবর্তিত"}{" "}
                      {formatChange(product.change.pct)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-start rounded-xl border border-[#ebf2ec] bg-[#f8faf8] p-4 sm:items-end sm:text-right">
                <span className="text-xs font-semibold text-gray-500">
                  আজকের গড় দাম
                </span>

                <div className="mt-1 text-2xl font-black text-[#21875a] sm:text-3xl">
                  ৳{formatBengaliPrice(product.today)}
                </div>

                <span className="text-xs text-gray-500">
                  টাকা / {product.unit}
                </span>

                <span
                  className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                    product.change.dir === "up"
                      ? "bg-[#e7f5eb] text-[#21875a]"
                      : product.change.dir === "down"
                        ? "bg-[#fff0ee] text-[#d94a42]"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span>
                    {product.change.dir === "up"
                      ? "▲"
                      : product.change.dir === "down"
                        ? "▼"
                        : "—"}
                  </span>

                  <span>{formatChange(product.change.pct)}</span>
                </span>
              </div>
            </section>

       
            <section className="mb-8 space-y-3">
              <h2 className="text-lg font-bold text-[#233527]">
                দামের সারসংক্ষেপ
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <PriceSummary
                  label="সর্বনিম্ন দাম"
                  price={minPrice}
                  description="সবচেয়ে কম দামের বাজার"
                  colorClass="text-[#21875a]"
                />

                <PriceSummary
                  label="সর্বোচ্চ দাম"
                  price={maxPrice}
                  description="সবচেয়ে বেশি দামের বাজার"
                  colorClass="text-[#d94a42]"
                />

                <PriceSummary
                  label="গড় দাম"
                  price={averagePrice}
                  description={`প্রতি ${product.unit} এর হিসাব`}
                  colorClass="text-[#233527]"
                />
              </div>
            </section>

    
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-[#233527]">
                দামের ইতিহাস
              </h2>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <PriceHistory label="আজ" price={product.today} />
                <PriceHistory label="গতকাল" price={product.yesterday} />
                <PriceHistory label="গত সপ্তাহ" price={product.lastWeek} />
                <PriceHistory label="গত মাস" price={product.lastMonth} />
              </div>
            </section>

   
            <section className="overflow-hidden rounded-2xl border border-[#e3ebe4] bg-white shadow-sm">
              <div className="border-b border-[#e3ebe4] bg-[#f4f8f5] p-5 md:p-6">
                <h2 className="text-lg font-bold text-[#233527]">
                  বাজারভিত্তিক আজকের দাম
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  বিভিন্ন বাজারে উপলব্ধ সর্বনিম্ন ও সর্বোচ্চ দাম
                </p>
              </div>

              {validMarkets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] text-left text-sm">
                    <thead className="border-b border-[#e3ebe4] bg-[#f9fbf9] text-gray-700">
                      <tr>
                        <th scope="col" className="px-5 py-4 font-bold">
                          বাজার
                        </th>
                        <th scope="col" className="px-5 py-4 font-bold">
                          বিভাগ
                        </th>
                        <th scope="col" className="px-5 py-4 text-center font-bold">
                          সর্বনিম্ন
                        </th>
                        <th scope="col" className="px-5 py-4 text-center font-bold">
                          সর্বোচ্চ
                        </th>
                        <th scope="col" className="px-5 py-4 text-right font-bold">
                          গড়
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#edf2ed] text-gray-700">
                      {validMarkets.map((market, index) => {
                        const marketAverage =
                          (market.min + market.max) / 2;

                        return (
                          <tr
                            key={`${market.market}-${index}`}
                            className="transition hover:bg-[#f9fbf9]"
                          >
                            <td className="px-5 py-4 font-medium text-gray-900">
                              {market.market}
                            </td>

                            <td className="px-5 py-4 text-gray-500">
                              {market.division}
                            </td>

                            <td className="px-5 py-4 text-center font-semibold text-[#21875a]">
                              ৳{formatBengaliPrice(market.min)}
                            </td>

                            <td className="px-5 py-4 text-center font-semibold text-[#d94a42]">
                              ৳{formatBengaliPrice(market.max)}
                            </td>

                            <td className="px-5 py-4 text-right font-semibold text-gray-800">
                              ৳{formatBengaliPrice(marketAverage)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-6 text-center text-gray-500">
                  এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
                </p>
              )}
            </section>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex rounded-xl border border-[#e3ebe4] bg-white px-5 py-3 font-semibold text-gray-700 transition hover:border-[#21875a] hover:text-[#21875a]"
              >
                ← সব পণ্যে ফিরে যান
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
