import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysOverdue(dueDate: string): number {
  const diff = Math.floor(
    (Date.now() - new Date(dueDate).getTime()) / 86_400_000,
  );
  return Math.max(0, diff);
}

export function getDayOfWeek(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
}

export const FREE_CHASE_LIMIT = 15;
export const PRO_PRICE = 19;
