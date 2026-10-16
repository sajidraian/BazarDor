import Link from "next/link";
import {
  formatBengaliNumber,
  formatPrice,
  getUnitLabel,
  type Product,
} from "@/lib/api";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isFlat = product.change.dir === "flat";

  const changeColor = isUp
    ? "bg-[#e7f5eb] text-[#21875a]"
    : isDown
      ? "bg-[#fff0ee] text-[#d94a42]"
      : "bg-gray-100 text-gray-500";

  const changeLabel = isUp
    ? `▲ ${formatBengaliNumber(Math.abs(product.change.pct))}%`
    : isDown
      ? `▼ ${formatBengaliNumber(Math.abs(product.change.pct))}%`
      : `— ${formatBengaliNumber(0)}%`;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-xl border border-[#e3ebe4] bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#a8d5b6] hover:shadow-md sm:p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f7f1] text-3xl sm:h-14 sm:w-14 sm:text-4xl">
          {product.image || product.categoryIcon}
        </div>

        <span
          className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold sm:text-xs ${changeColor}`}
        >
          {changeLabel}
        </span>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-bold text-[#293a2e] group-hover:text-[#21875a] sm:text-[15px]">
          {product.nameBn}
        </h3>

        <p className="mt-1 text-[11px] text-gray-500">
          {getUnitLabel(product.unit)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-[#edf1ed] pt-3">
        <div>
          <p className="text-[10px] text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-sm font-extrabold text-[#21875a] sm:text-base">
            {formatPrice(product.today)}
          </p>
        </div>

        <span className="text-[10px] text-gray-400">
          {isFlat ? "অপরিবর্তিত" : isUp ? "দাম বেড়েছে" : "দাম কমেছে"}
        </span>
      </div>
    </Link>
  );
}