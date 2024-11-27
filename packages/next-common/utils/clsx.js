import clsx from "clsx";
import { twMerge } from "./tailwind/tailwindMerge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
