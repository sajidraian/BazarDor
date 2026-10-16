"use client";

const tickerProducts = [
  { emoji: "🍚", name: "মিনিকেট চাল", price: "৭৫ টাকা/কেজি", change: "▲ ২.১%", trend: "up" },
  { emoji: "🧅", name: "পেঁয়াজ", price: "৬০ টাকা/কেজি", change: "▼ ৩.২%", trend: "down" },
  { emoji: "🥔", name: "আলু", price: "৩৫ টাকা/কেজি", change: "— ০.০%", trend: "flat" },
  { emoji: "🥚", name: "ডিম", price: "১৪০ টাকা/ডজন", change: "▲ ১.৫%", trend: "up" },
  { emoji: "🫙", name: "সয়াবিন তেল", price: "১৭০ টাকা/লিটার", change: "▼ ১.২%", trend: "down" },
  { emoji: "🐟", name: "ইলিশ মাছ", price: "১,২০০ টাকা/কেজি", change: "▲ ২.৮%", trend: "up" },
];

export default function PriceTicker() {
  return (
    <div
      className="overflow-hidden border-b border-[#dce9df] bg-white"
      aria-label="পণ্যের দামের চলমান তালিকা"
    >
      <div className="ticker-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1}
          >
            {tickerProducts.map((product) => (
              <div
                key={`${copy}-${product.name}`}
                className="flex shrink-0 items-center gap-2 border-r border-[#e7eee8] px-5 py-2.5 text-xs"
              >
                <span className="text-base">{product.emoji}</span>

                <span className="font-semibold text-gray-700">
                  {product.name}
                </span>

                <span className="text-gray-500">{product.price}</span>

                <span
                  className={`font-bold ${
                    product.trend === "up"
                      ? "text-green-600"
                      : product.trend === "down"
                        ? "text-red-500"
                        : "text-gray-400"
                  }`}
                >
                  {product.change}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 35s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
