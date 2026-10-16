"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("প্রোফাইল দেখতে আগে সাইন ইন করুন।");
      router.replace("/sign-in");
    } else if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("সফলভাবে সাইন আউট হয়েছে!");
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    }
  };

  if (isPending) {
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

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f4f7f4]">
      {/* Navbar & Price Ticker */}
      <Navbar />
      <PriceTicker />

      <div className="container-main py-10 md:py-14 max-w-4xl">
        {/* Header Title & Subtitle */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1e2920] md:text-3xl">
              আমার প্রোফাইল
            </h1>
            <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
              আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
            </p>
          </div>
          <Link
            href="/profile/update"
            className="rounded-xl bg-[#21875a] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#196b47]"
          >
            প্রোফাইল আপডেট করুন
          </Link>
        </div>

        {/* User Info Card */}
        <div className="mb-6 rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={name}
                className="h-14 w-14 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#21875a] text-lg font-bold text-white">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            <div>
              <h2 className="text-base font-bold text-[#1e2920] sm:text-lg">
                {name || "ব্যবহারকারী"}
              </h2>
              <p className="text-xs text-gray-500 sm:text-sm">
                {email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#ffdada] bg-[#fff5f5] px-4 py-2.5 text-xs font-semibold text-[#d94a42] transition hover:bg-[#ffebee]"
          >
            <span>🚪</span>
            <span>সাইন আউট</span>
          </button>
        </div>

        {/* Data / Settings Section */}
        <div className="rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-base font-bold text-[#1e2920] mb-6">
            তথ্য
          </h3>

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 sm:text-sm mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-[#fbfdfb] px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none cursor-not-allowed"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 sm:text-sm mb-1.5">
                ইমেইল
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-xl border border-[#21875a] bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none ring-1 ring-[#21875a] cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}