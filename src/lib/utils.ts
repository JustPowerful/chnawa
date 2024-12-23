import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// reduce string with n characters and add '...' at the end
export function reduceStr(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}
