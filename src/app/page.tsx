import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <PriceTicker />

      <Hero />

      <section className="container-main py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">
              আজ দাম বেড়েছে
              <span className="ml-2 text-red-500">▲</span>
            </h2>

            <p className="section-subtitle">
              যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে
            </p>
          </div>
        </div>

        <ProductGrid limit={6} trend="up" />
      </section>

      <section className="container-main py-12">
        <div className="mb-6">
          <h2 className="section-title">
            আজ দাম কমেছে
            <span className="ml-2 text-green-600">▼</span>
          </h2>

          <p className="section-subtitle">
            যেসব পণ্যের দাম কমেছে
          </p>
        </div>

        <ProductGrid limit={6} trend="down" />
      </section>

      <section
        id="সব-পণ্য"
        className="container-main py-12"
      >
        <div className="mb-6">
          <h2 className="section-title">
            সব পণ্য
          </h2>

          <p className="section-subtitle">
            বাজারের নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ দর
          </p>
        </div>

        <ProductGrid />
      </section>
    </main>
  );
}