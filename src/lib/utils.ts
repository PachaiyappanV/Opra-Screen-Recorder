import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});
