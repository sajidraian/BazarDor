
"use client";

import { useState } from "react";
import { ArrowDown, TrendingUp } from "lucide-react";
import MarketComparison from "@/components/MarketComparison";

export default function Hero() {
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const today = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date());

  const openComparison = () => {
    setIsComparisonOpen(true);
  };

  const closeComparison = () => {
    setIsComparisonOpen(false);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {/* Left content */}
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm">
              <TrendingUp className="h-4 w-4" />
              <span>আজকের বাজারদর এক জায়গায়</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              সঠিক বাজারদর,
              <span className="mt-2 block text-orange-600">
                সাশ্রয়ী কেনাকাটা
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              বাংলাদেশের বিভিন্ন বাজারের নিত্যপ্রয়োজনীয় পণ্যের দাম জানুন।
              বাজারদর তুলনা করে আপনার কেনাকাটার সিদ্ধান্ত নিন আরও সহজে।
            </p>

            <p className="mt-4 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">আজ:</span>{" "}
              {today}
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                সব পণ্য দেখুন
                <ArrowDown className="h-4 w-4" />
              </a>

              {/* Penpot shape: ⚖️ বাজার তুলনা */}
              <button
                type="button"
                onClick={openComparison}
                className="inline-flex items-center justify-center rounded-lg border border-orange-500 bg-white px-5 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                ⚖️ বাজার তুলনা
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-orange-100 pt-6">
              <div>
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  ৬
                </p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  বিভাগ
                </p>
              </div>

              <div>
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  ১২+
                </p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  পণ্যের ধরন
                </p>
              </div>

              <div>
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  ৩৩+
                </p>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  বাজার
                </p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-orange-200/50 blur-2xl" />
            <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-amber-200/50 blur-2xl" />

            <div className="relative rounded-3xl border border-orange-100 bg-white p-5 shadow-xl sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    বাজারদরের আপডেট
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    আজকের বাজার
                  </h2>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  বাজারদর
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍚</span>
                    <div>
                      <p className="font-semibold text-gray-900">চাল</p>
                      <p className="text-xs text-gray-500">
                        নিত্যপ্রয়োজনীয় পণ্য
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-orange-700">
                    দাম তুলনা করুন
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🫘</span>
                    <div>
                      <p className="font-semibold text-gray-900">ডাল</p>
                      <p className="text-xs text-gray-500">
                        নিত্যপ্রয়োজনীয় পণ্য
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-amber-700">
                    দাম তুলনা করুন
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧅</span>
                    <div>
                      <p className="font-semibold text-gray-900">পেঁয়াজ</p>
                      <p className="text-xs text-gray-500">
                        নিত্যপ্রয়োজনীয় পণ্য
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-green-700">
                    দাম তুলনা করুন
                  </span>
                </div>
              </div>

              {/* Same Penpot button shape */}
              <button
                type="button"
                onClick={openComparison}
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                ⚖️ বাজার তুলনা
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Market comparison modal */}
      {isComparisonOpen && (
        <MarketComparison onClose={closeComparison} />
      )}
    </>
  );
}
