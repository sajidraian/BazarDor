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

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const { data: session, isPending: sessionPending } = useSession();

  const notified = useRef(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    if (sessionPending || !session) return;

    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const products = await getProducts();
        const found = products.find((item) => item.slug === slug);

        if (!active) return;

        if (!found) {
          setProduct(null);
          setError("এই পণ্যটি খুঁজে পাওয়া যায়নি।");
          return;
        }

        setProduct(found);
      } catch {
        if (active) {
          setProduct(null);
          setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug, session, sessionPending]);

  if (sessionPending || !session) {
    return (
      <main className="container-main min-h-screen py-12">
        <div className="mx-auto max-w-4xl animate-pulse space-y-5">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="h-64 rounded-2xl bg-gray-200" />
            <div className="h-64 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  // Derive market prices and averages safely
  const markets = product?.markets ?? [];
  const marketMinPrices = markets.map((m) => Number(m.min)).filter(Number.isFinite);
  const marketMaxPrices = markets.map((m) => Number(m.max)).filter(Number.isFinite);

  const minPrice = marketMinPrices.length > 0 ? Math.min(...marketMinPrices) : product?.today ?? 0;
  const maxPrice = marketMaxPrices.length > 0 ? Math.max(...marketMaxPrices) : product?.today ?? 0;
  
  const averagePrice = 
    marketMinPrices.length > 0 && marketMaxPrices.length > 0
      ? (marketMinPrices.reduce((a, b) => a + b, 0) + marketMaxPrices.reduce((a, b) => a + b, 0)) / (marketMinPrices.length + marketMaxPrices.length)
      : product?.today ?? 0;

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
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-gray-200" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-72 rounded-2xl bg-gray-200" />
              <div className="h-72 rounded-2xl bg-gray-200" />
            </div>
            <div className="h-48 rounded-2xl bg-gray-200" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="mb-3 text-4xl" aria-hidden="true">
              🔎
            </p>
            <h1 className="text-xl font-bold text-gray-900">
              {error}
            </h1>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-[#21875a] px-5 py-3 font-semibold text-white hover:bg-[#176b45]"
            >
              হোমপেজে ফিরে যান
            </Link>
          </div>
        ) : product ? (
          <>
            {/* Breadcrumb & Header Info */}
            <div className="mb-8">
              <nav className="mb-3 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
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
                <span className="font-medium text-gray-800">{product.nameBn}</span>
              </nav>
            </div>

            {/* Top Main Product Overview Card */}
            <div className="mb-8 flex flex-col justify-between gap-6 rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
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
                    <span className={product.change.dir === "up" ? "text-[#21875a] font-bold" : product.change.dir === "down" ? "text-[#d94a42] font-bold" : "font-bold"}>
                      {product.change.dir === "up" ? "বেড়েছে" : product.change.dir === "down" ? "কমেছে" : "অপরিবর্তিত"} {formatChange(product.change.pct)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Today's Average Price Badge Box */}
              <div className="flex shrink-0 flex-col items-start rounded-xl bg-[#f8faf8] border border-[#ebf2ec] p-4 text-left sm:items-end sm:text-right">
                <span className="text-xs font-semibold text-gray-500">আজকের গড় দাম</span>
                <div className="mt-1 text-2xl font-black text-[#21875a] sm:text-3xl">
                  ৳{formatBengaliPrice(product.today)}
                </div>
                <span className="text-xs text-gray-500">টাকা / {product.unit}</span>
                
                <span
                  className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${
                    product.change.dir === "up"
                      ? "bg-[#e7f5eb] text-[#21875a]"
                      : product.change.dir === "down"
                      ? "bg-[#fff0ee] text-[#d94a42]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span>{product.change.dir === "up" ? "▲" : product.change.dir === "down" ? "▼" : "—"}</span>
                  <span>{formatChange(product.change.pct)}</span>
                </span>
              </div>
            </div>

            {/* Price Summary Section */}
            <section className="mb-8 space-y-3">
              <h2 className="text-lg font-bold text-[#233527]">দামের সারসংক্ষেপ</h2>
              
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

            {/* Price History Section */}
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

            {/* Market-wise Price Table */}
            <section className="overflow-hidden rounded-2xl border border-[#e3ebe4] bg-white shadow-sm">
              <div className="border-b border-[#e3ebe4] p-5 md:p-6 bg-[#f4f8f5]">
                <h2 className="text-lg font-bold text-[#233527]">
                  বাজারভিত্তিক আজকের দাম
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  বিভিন্ন বাজারে উপলব্ধ সর্বনিম্ন ও সর্বোচ্চ দাম
                </p>
              </div>

              {markets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] text-left text-sm">
                    <thead className="bg-[#f9fbf9] text-gray-700 border-b border-[#e3ebe4]">
                      <tr>
                        <th className="px-5 py-4 font-bold">বাজার</th>
                        <th className="px-5 py-4 font-bold">বিভাগ</th>
                        <th className="px-5 py-4 font-bold text-center">সর্বনিম্ন</th>
                        <th className="px-5 py-4 font-bold text-center">সর্বোচ্চ</th>
                        <th className="px-5 py-4 font-bold text-right">গড়</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#edf2ed] text-gray-700">
                      {markets.map((market, index) => {
                        const mMin = Number(market.min);
                        const mMax = Number(market.max);
                        const mAvg = (mMin + mMax) / 2;

                        return (
                          <tr
                            key={`${market.market}-${index}`}
                            className="hover:bg-[#f9fbf9] transition"
                          >
                            <td className="px-5 py-4 font-medium text-gray-900">
                              {market.market}
                            </td>
                            <td className="px-5 py-4 text-gray-500">
                              {market.division}
                            </td>
                            <td className="px-5 py-4 font-semibold text-[#21875a] text-center">
                              ৳{formatBengaliPrice(mMin)}
                            </td>
                            <td className="px-5 py-4 font-semibold text-[#d94a42] text-center">
                              ৳{formatBengaliPrice(mMax)}
                            </td>
                            <td className="px-5 py-4 font-semibold text-gray-800 text-right">
                              ৳{formatBengaliPrice(mAvg)}
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