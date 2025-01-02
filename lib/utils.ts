import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

  if (now.getTime() - date.getTime() > oneWeekInMs) {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}