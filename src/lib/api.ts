
export const API_BASE_URL =
  "https://api.api-store.workers.dev/api/bazardor";

export type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

async function fetchApi<T>(endpoint: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`);
  } catch {
    throw new Error(
      "সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না। ইন্টারনেট সংযোগ পরীক্ষা করুন।"
    );
  }

  if (!response.ok) {
    throw new Error(
      `তথ্য লোড করা যায়নি। Server status: ${response.status}`
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("সার্ভার থেকে সঠিক তথ্য পাওয়া যায়নি।");
  }
}

export async function getProducts(): Promise<Product[]> {
  const data = await fetchApi<unknown>("/products");

  if (!Array.isArray(data)) {
    throw new Error("পণ্যের তথ্য সঠিক ফরম্যাটে পাওয়া যায়নি।");
  }

  return data as Product[];
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchApi<unknown>("/categories");

  if (!Array.isArray(data)) {
    throw new Error("ক্যাটাগরির তথ্য সঠিক ফরম্যাটে পাওয়া যায়নি।");
  }

  return data as Category[];
}

export function formatBengaliNumber(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPrice(value: number): string {
  return `${formatBengaliNumber(value)} টাকা`;
}

export function getUnitLabel(unit: string): string {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };

  return units[unit] ?? `প্রতি ${unit}`;
}
