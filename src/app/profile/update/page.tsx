"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateInformationPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নাম লিখুন।");
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("নাম ১০০ অক্ষরের মধ্যে রাখুন।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error(
          result.error.message || "তথ্য আপডেট করা যায়নি।"
        );
        return;
      }

      toast.success("তোমার নাম সফলভাবে আপডেট হয়েছে!");

      await authClient.getSession();
      router.push("/profile");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  if (isPending || !session) {
    return (
      <main className="min-h-screen bg-[#f4f7f4]">
        <Navbar />
        <PriceTicker />
        <div className="container-main py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#21875a] border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">লোড হচ্ছে...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f4]">

      <Navbar />
      <PriceTicker />

      <div className="container-main py-10 md:py-14 max-w-xl">
   
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#1e2920] md:text-3xl">
            প্রোফাইল আপডেট করুন
          </h1>
          <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
            তোমার অ্যাকাউন্টের নাম পরিবর্তন করো।
          </p>
        </div>

       
        <div className="rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-gray-700 sm:text-sm mb-1.5"
              >
                নাম
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="তোমার নাম লিখুন"
                className="w-full rounded-xl border border-[#21875a] bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none ring-1 ring-[#21875a] transition focus:border-[#21875a]"
              />
            </div>

        
            <div>
              <label className="block text-xs font-semibold text-gray-700 sm:text-sm mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                value={session.user.email || ""}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-[#fbfdfb] px-3.5 py-2.5 text-sm text-gray-500 outline-none cursor-not-allowed"
              />
            </div>

      
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full rounded-xl bg-[#21875a] py-3 text-sm font-bold text-white transition hover:bg-[#196b47] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "আপডেট হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
            </button>


            <div className="text-center pt-2">
              <Link
                href="/profile"
                className="text-xs font-semibold text-[#21875a] hover:underline"
              >
                ← প্রোফাইলে ফিরে যান
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}