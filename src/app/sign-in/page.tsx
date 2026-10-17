"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড পূরণ করুন।");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.email({ email, password });

      if (result.error) {
        toast.error(
          result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignIn(provider: "google" | "github") {
    setSocialLoading(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(
          result.error.message || `${provider} দিয়ে সাইন ইন করা যায়নি।`
        );
        setSocialLoading("");
      }
    } catch {
      toast.error(`${provider} দিয়ে সাইন ইন করা যায়নি।`);
      setSocialLoading("");
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7f4]">
  
      <Navbar />
      <PriceTicker />

      <div className="container-main py-10 md:py-14">
 
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#1e2920] md:text-3xl">
            সাইন ইন
          </h1>
          <p className="mt-2 text-xs text-gray-500 sm:text-sm">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

   
        <div className="mx-auto max-w-md rounded-2xl border border-[#e3ebe4] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
  
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700 sm:text-sm"
              >
                ইমেইল
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#fbfdfb] px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#21875a] focus:bg-white focus:ring-1 focus:ring-[#21875a]"
              />
            </div>


            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700 sm:text-sm"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#fbfdfb] px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#21875a] focus:bg-white focus:ring-1 focus:ring-[#21875a]"
              />
            </div>


            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="mt-2 w-full rounded-xl bg-[#21875a] py-3 text-sm font-bold text-white transition hover:bg-[#196b47] disabled:opacity-50"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

      
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-gray-400">
              অথবা
            </span>
          </div>


          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={loading || !!socialLoading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{socialLoading === "google" ? "অপেক্ষা..." : "Google দিয়ে চালিয়ে যান"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={loading || !!socialLoading}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>{socialLoading === "github" ? "অপেক্ষা..." : "GitHub দিয়ে চালিয়ে যান"}</span>
            </button>
          </div>

        
          <p className="mt-6 text-center text-xs text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="font-bold text-[#21875a] hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </div>

       
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-[#21875a] hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}