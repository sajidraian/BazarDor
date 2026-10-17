
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRightLeft,
  CheckCircle2,
  X,
} from "lucide-react";

import {
  getProducts,
  formatPrice,
  getUnitLabel,
} from "@/lib/api";

import type { Product, Market } from "@/lib/api";

type MarketComparisonProps = {
  onClose: () => void;
};

function getMarketKey(market: Market): string {
  return `${market.division}::${market.market}`;
}

export default function MarketComparison({
  onClose,
}: MarketComparisonProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [marketA, setMarketA] = useState("");
  const [marketB, setMarketB] = useState("");
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

        if (!active) return;

        setProducts(data);
        setProductId((current) => {
          if (data.some((product) => String(product.id) === current)) {
            return current;
          }

          return data[0] ? String(data[0].id) : "";
        });
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "পণ্যের তথ্য লোড করা যায়নি।"
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

  const selectedProduct = products.find(
    (product) => String(product.id) === productId
  );

  const markets = useMemo(() => {
    if (!selectedProduct || !Array.isArray(selectedProduct.markets)) {
      return [];
    }

    const uniqueMarkets = new Map<string, Market>();

    for (const market of selectedProduct.markets) {
      if (
        !market ||
        typeof market.market !== "string" ||
        typeof market.division !== "string" ||
        !market.market.trim() ||
        !market.division.trim() ||
        typeof market.min !== "number" ||
        typeof market.max !== "number" ||
        !Number.isFinite(market.min) ||
        !Number.isFinite(market.max) ||
        market.min < 0 ||
        market.max < market.min
      ) {
        continue;
      }

      const key = getMarketKey(market);

      if (!uniqueMarkets.has(key)) {
        uniqueMarkets.set(key, market);
      }
    }

    return Array.from(uniqueMarkets.values());
  }, [selectedProduct]);

  const firstMarket = markets.find(
    (market) => getMarketKey(market) === marketA
  );

  const secondMarket = markets.find(
    (market) => getMarketKey(market) === marketB
  );

  const canCompare =
    Boolean(firstMarket) &&
    Boolean(secondMarket) &&
    marketA !== marketB;

  const difference =
    canCompare && firstMarket && secondMarket
      ? Math.abs(firstMarket.min - secondMarket.min)
      : 0;

  const cheaperMarket =
    canCompare && firstMarket && secondMarket
      ? firstMarket.min < secondMarket.min
        ? firstMarket
        : secondMarket.min < firstMarket.min
          ? secondMarket
          : null
      : null;

  function handleProductChange(value: string) {
    setProductId(value);
    setMarketA("");
    setMarketB("");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-950/50 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="market-comparison-title"
        className="my-auto w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f2e7] px-3 py-1 text-xs font-semibold text-[#21875a]">
              <ArrowDownUp size={14} />
              বাজার দর
            </span>

            <h2
              id="market-comparison-title"
              className="mt-3 text-xl font-extrabold text-gray-900 sm:text-2xl"
            >
              বাজার তুলনা
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              একই পণ্যের দুইটি বাজারের দাম পাশাপাশি দেখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="তুলনা বন্ধ করুন"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center" role="status">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#21875a]" />
            <p className="mt-3 text-sm text-gray-500">
              পণ্যের তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : error ? (
          <div
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4"
            role="alert"
          >
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
            API-তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="comparison-product"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                ১. পণ্য নির্বাচন করুন
              </label>

              <select
                id="comparison-product"
                value={productId}
                onChange={(event) => handleProductChange(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-800 outline-none focus:border-[#21875a] focus:ring-2 focus:ring-[#21875a]/15"
              >
                {products.map((product) => (
                  <option key={product.id} value={String(product.id)}>
                    {product.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="comparison-market-a"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  ২. প্রথম বাজার
                </label>

                <select
                  id="comparison-market-a"
                  value={marketA}
                  onChange={(event) => setMarketA(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#21875a]"
                >
                  <option value="">বাজার নির্বাচন করুন</option>

                  {markets.map((market) => (
                    <option
                      key={getMarketKey(market)}
                      value={getMarketKey(market)}
                      disabled={getMarketKey(market) === marketB}
                    >
                      {market.market} — {market.division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="comparison-market-b"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  ৩. দ্বিতীয় বাজার
                </label>

                <select
                  id="comparison-market-b"
                  value={marketB}
                  onChange={(event) => setMarketB(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#21875a]"
                >
                  <option value="">বাজার নির্বাচন করুন</option>

                  {markets.map((market) => (
                    <option
                      key={getMarketKey(market)}
                      value={getMarketKey(market)}
                      disabled={getMarketKey(market) === marketA}
                    >
                      {market.market} — {market.division}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {markets.length < 2 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  এই পণ্যের জন্য পর্যাপ্ত বাজারের তথ্য নেই।
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  অন্য পণ্য নির্বাচন করে দেখুন।
                </p>
              </div>
            ) : !canCompare ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
                <ArrowRightLeft
                  size={24}
                  className="mx-auto text-gray-400"
                />
                <p className="mt-2 text-sm font-semibold text-gray-700">
                  দুটি আলাদা বাজার নির্বাচন করুন
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  এরপর দাম ও পার্থক্য এখানে দেখা যাবে।
                </p>
              </div>
            ) : firstMarket && secondMarket ? (
              <div className="rounded-2xl border border-[#dcebe0] bg-[#f5faf6] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-gray-900">
                    {selectedProduct?.nameBn}
                  </h3>

                  <span className="text-xs text-gray-500">
                    {getUnitLabel(selectedProduct?.unit ?? "kg")}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[firstMarket, secondMarket].map((market) => {
                    const isCheaper = cheaperMarket === market;

                    return (
                      <div
                        key={getMarketKey(market)}
                        className={`min-w-0 rounded-xl border bg-white p-3 sm:p-4 ${
                          isCheaper
                            ? "border-[#21875a] ring-1 ring-[#21875a]/20"
                            : "border-gray-200"
                        }`}
                      >
                        <p className="truncate text-sm font-bold text-gray-800">
                          {market.market}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {market.division}
                        </p>

                        <div className="mt-4">
                          <p className="text-xs text-gray-500">
                            সর্বনিম্ন দাম
                          </p>
                          <p className="mt-1 break-words text-lg font-extrabold text-gray-900 sm:text-xl">
                            {formatPrice(market.min)}
                          </p>
                        </div>

                        <div className="mt-3 border-t border-gray-100 pt-3">
                          <p className="text-xs text-gray-500">
                            সর্বোচ্চ দাম
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold text-gray-700">
                            {formatPrice(market.max)}
                          </p>
                        </div>

                        {isCheaper && (
                          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#e3f2e7] px-2 py-1 text-xs font-semibold text-[#21875a]">
                            <CheckCircle2 size={13} />
                            কম সর্বনিম্ন দাম
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl border border-[#e0ebe2] bg-white p-4 text-center">
                  <p className="text-sm text-gray-500">
                    সর্বনিম্ন দামের পার্থক্য
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-[#21875a]">
                    {formatPrice(difference)}
                  </p>

                  {firstMarket.min === secondMarket.min ? (
                    <p className="mt-1 text-sm text-gray-600">
                      দুটি বাজারেই সর্বনিম্ন দাম সমান।
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-600">
                      {cheaperMarket?.market} বাজারে সর্বনিম্ন দাম কম।
                    </p>
                  )}

                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    হিসাবটি API-তে দেওয়া সর্বনিম্ন দামের ভিত্তিতে করা হয়েছে।
                    দোকানের প্রকৃত দাম পরিবর্তিত হতে পারে।
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
