import { clsx } from "clsx";

/** Small wrapper so class-name composition reads the same everywhere. */
export function cn(...inputs) {
  return clsx(...inputs);
}
