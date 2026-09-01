import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Canonical shadcn/ui class merge: clsx resolves the conditional shapes,
// tailwind-merge dedupes conflicting Tailwind utilities so the last one wins.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
