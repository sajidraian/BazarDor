export default function Footer() {
  return (
    <footer className="border-t border-[#e5e7eb] bg-white py-6 mt-12">
      <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        {/* Left text */}
        <p className="text-left">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        {/* Right text */}
        <p className="text-center sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}