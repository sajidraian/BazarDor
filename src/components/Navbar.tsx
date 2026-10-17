
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

const categories = [
  { name: "চাল", slug: "chal", icon: "🍚" },
  { name: "ডাল", slug: "dal", icon: "🫘" },
  { name: "তেল", slug: "tel", icon: "🛢️" },
  { name: "সবজি", slug: "sobji", icon: "🥬" },
  { name: "মাছ", slug: "mach", icon: "🐟" },
  { name: "মাংস", slug: "mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dui", icon: "🥛" },
  { name: "মসলা", slug: "mosla", icon: "🌶️" },
];

function getBanglaDate() {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  // Close the profile dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function isActiveCategory(slug: string) {
    return pathname === `/category/${slug}`;
  }

  async function handleSignOut() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await signOut();

      setMenuOpen(false);
      setUserMenuOpen(false);

      toast.success("সফলভাবে সাইন আউট হয়েছে!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoggingOut(false);
    }
  }

  function ProfileAvatar({
    size = "h-9 w-9",
  }: {
    size?: string;
  }) {
    if (user?.image) {
      return (
        <img
          src={user.image}
          alt="Profile"
          referrerPolicy="no-referrer"
          className={`${size} shrink-0 rounded-full border border-[#dce9df] object-cover`}
        />
      );
    }

    return (
      <span
        className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[#e5f4e9] text-[#1d8e4e]`}
      >
        <UserRound size={19} />
      </span>
    );
  }

  function CategoryLinks({
    mobile = false,
  }: {
    mobile?: boolean;
  }) {
    return (
      <>
        {categories.map((category) => {
          const active = isActiveCategory(category.slug);

          return (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              onClick={() => {
                setMenuOpen(false);
                setUserMenuOpen(false);
              }}
              aria-current={active ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 transition ${
                mobile
                  ? `rounded-lg px-3 py-3 text-sm ${
                      active
                        ? "bg-[#1d8e4e] text-white"
                        : "bg-[#f1f7f2] text-gray-700 hover:bg-[#e5f4e9]"
                    }`
                  : `rounded-md px-3 py-2 text-sm ${
                      active
                        ? "bg-[#1d8e4e] text-white"
                        : "text-gray-600 hover:bg-[#edf7ef] hover:text-[#1d8e4e]"
                    }`
              }`}
            >
              <span
                className={mobile ? "text-lg" : "text-base"}
                aria-hidden="true"
              >
                {category.icon}
              </span>

              <span className="font-medium">{category.name}</span>
            </Link>
          );
        })}
      </>
    );
  }

  function AuthLinks({
    mobile = false,
  }: {
    mobile?: boolean;
  }) {
    if (isPending) {
      return (
        <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-100" />
      );
    }

    if (user) {
      if (mobile) {
        return (
          <>
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="col-span-2 flex min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#edf7ef]"
            >
              <ProfileAvatar size="h-10 w-10" />

              <span className="min-w-0">
                <span className="block">আমার প্রোফাইল</span>
                <span className="block max-w-56 truncate text-xs text-gray-500">
                  {user.name || user.email}
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={loggingOut}
              className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-[#ffdada] bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#d94a42] transition hover:bg-[#ffebee] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={16} />
              {loggingOut ? "অপেক্ষা করো..." : "সাইন আউট"}
            </button>
          </>
        );
      }

      // Desktop profile dropdown
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            aria-label="প্রোফাইল মেনু"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-[#fbfdfb] px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ProfileAvatar size="h-7 w-7" />

            <span className="max-w-[120px] truncate">
              {user.name || "ব্যবহারকারী"}
            </span>

            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-[9999] mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
            >
              {/* User profile information */}
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setUserMenuOpen(false)}
                className="flex min-w-0 items-center gap-3 border-b border-gray-100 pb-4 transition hover:opacity-80"
              >
                <ProfileAvatar size="h-11 w-11" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {user.name || "ব্যবহারকারী"}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {user.email}
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#1d8e4e]">
                    আমার প্রোফাইল দেখুন
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className="-rotate-90 shrink-0 text-gray-400"
                />
              </Link>

              {/* Sign out */}
              <div className="pt-3">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#ffdada] bg-[#fff5f5] py-2.5 text-xs font-semibold text-[#d94a42] transition hover:bg-[#ffebee] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={14} />

                  <span>
                    {loggingOut ? "অপেক্ষা করো..." : "সাইন আউট"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <Link
          href="/sign-in"
          onClick={() => setMenuOpen(false)}
          className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#1d8e4e] transition hover:bg-[#edf7ef] ${
            mobile ? "border border-[#dce9df] py-3" : ""
          }`}
        >
          <UserRound size={16} />
          সাইন ইন
        </Link>

        <Link
          href="/sign-up"
          onClick={() => setMenuOpen(false)}
          className={`flex items-center justify-center gap-2 rounded-lg bg-[#1d8e4e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#166e3c] ${
            mobile ? "py-3" : ""
          }`}
        >
          <UserRound size={16} />
          সাইন আপ
        </Link>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white">
      {/* Logo and account actions */}
      <div className="container-main flex min-h-[68px] items-center justify-between gap-3 py-2">
        <Link
          href="/"
          onClick={() => {
            setMenuOpen(false);
            setUserMenuOpen(false);
          }}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1d8e4e] shadow-sm transition-transform group-hover:scale-105">
            <span className="text-xl" aria-hidden="true">
              🛒
            </span>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xl font-bold leading-tight tracking-tight text-gray-900">
              বাজার দর
            </span>

            <span className="mt-0.5 text-xs font-normal leading-tight text-gray-500">
              {getBanglaDate()}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <AuthLinks />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#1d8e4e] transition hover:bg-[#edf7ef] sm:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Desktop category navigation */}
      <nav
        aria-label="পণ্যের বিভাগ"
        className="border-t border-[#edf2ed]"
      >
        <div className="container-main hidden items-center gap-1 overflow-x-auto py-2 sm:flex">
          <CategoryLinks />
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-[#edf2ed] bg-white px-4 py-4 shadow-lg sm:hidden">
          <nav
            aria-label="মোবাইল পণ্যের বিভাগ"
            className="grid grid-cols-2 gap-2"
          >
            <CategoryLinks mobile />
          </nav>

          <div className="mt-4 grid grid-cols-2 items-center gap-2 border-t border-[#edf2ed] pt-4">
            <AuthLinks mobile />
          </div>
        </div>
      )}
    </header>
  );
}
