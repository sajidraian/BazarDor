
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import MarketComparison from "@/components/MarketComparison";

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

const stats = [
  {
    label: "বিভাগ",
    value: "৬",
    description: "টি বিভাগের তথ্য",
  },
  {
    label: "বাজার",
    value: "১২",
    description: "টি বাজার অন্তর্ভুক্ত",
  },
  {
    label: "পণ্য",
    value: "৩৩",
    description: "টি নিত্যদিনের পণ্য",
  },
];

export default function Hero() {
  const [comparisonOpen, setComparisonOpen] = useState(false);

  return (
    <>
      <section className="container-main pt-5 sm:pt-7">
        <div className="grid items-center gap-6 rounded-2xl border border-[#e5eee6] bg-[#fbfdfb] px-5 py-6 shadow-sm sm:px-8 sm:py-8 lg:grid-cols-[1.35fr_0.85fr] lg:gap-8 lg:px-9 lg:py-9">
          {/* Left: Hero Content */}
          <div className="relative z-10 min-w-0">
            <span className="inline-flex items-center rounded-full bg-[#e3f2e7] px-3 py-1 text-xs font-semibold text-[#21875a]">
              {getBanglaDate()}
            </span>

            <h1 className="mt-3 text-2xl font-black leading-snug tracking-tight text-gray-900 sm:text-3xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm sm:leading-6">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="#সব-পণ্য"
                className="inline-flex items-center gap-2 rounded-lg bg-[#21875a] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#176b45] sm:text-sm"
              >
                সব পণ্য দেখুন
                <ArrowRight size={16} />
              </Link>

              <button
                type="button"
                onClick={() => setComparisonOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#d7e2d9] bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-[#21875a] hover:bg-[#f0f7f1] sm:text-sm"
              >
                <Scale size={15} />
                বাজার তুলনা
              </button>
            </div>
          </div>

          {/* Right: Statistics */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#e5eee6] bg-[#f0f6f1] p-3 sm:gap-3 sm:p-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-0 flex-col justify-center rounded-lg px-1 py-3 sm:px-2"
              >
                <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
                  {stat.label}
                </span>

                <span className="mt-1 text-2xl font-extrabold leading-tight text-[#21875a] sm:text-3xl">
                  {stat.value}
                </span>

                <span className="mt-1 text-[9px] leading-4 text-gray-500 sm:text-[10px]">
                  {stat.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Comparison Modal */}
      {comparisonOpen && (
        <MarketComparison
          onClose={() => setComparisonOpen(false)}
        />
      )}
    </>
  );
}
