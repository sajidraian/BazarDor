import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Hero() {
  return (
    <section className="container-main pt-5">
      <div className="relative flex min-h-[220px] items-center justify-between gap-6 overflow-hidden rounded-3xl border border-[#e8eee9] bg-[#fbfdfb] px-8 py-8 sm:px-12 sm:py-10 shadow-sm">
        {/* Left Content */}
        <div className="relative z-10 max-w-xl">
          {/* Bangla Date Badge */}
          <span className="inline-flex items-center rounded-full bg-[#e3f2e7] px-3.5 py-1 text-xs font-semibold text-[#21875a]">
            {getBanglaDate()}
          </span>

          {/* Heading */}
          <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl leading-snug">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Subtitle Description */}
          <p className="mt-3 max-w-lg text-xs leading-relaxed text-gray-500 sm:text-sm">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* Primary CTA Button (Anchor Link to #সব-পণ্য) */}
          <Link
            href="#সব-পণ্য"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#21875a] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#176b45] sm:text-sm"
          >
            সব পণ্য দেখুন
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right Banner Image */}
        <div className="relative hidden h-44 w-52 shrink-0 items-center justify-center sm:flex">
          <Image
            src="/bazar-hero.png"
            alt="Hero Banner Illustration"
            width={208}
            height={176}
            className="h-full w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}