import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const gradients = [
  'from-purple-500 to-pink-500',
  'from-green-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-pink-600',
  'from-cyan-400 to-blue-400',
  'from-emerald-400 to-green-600',
  'from-violet-400 to-fuchsia-500',
  'from-fuchsia-500 to-pink-400',
  'from-rose-400 to-amber-400',
  'from-lime-400 to-emerald-500',
  'from-sky-400 to-cyan-500',
  'from-indigo-600 to-purple-600',
  'from-amber-400 to-yellow-500',
  'from-rose-500 to-red-500',
  'from-teal-400 to-cyan-600'
];

export function randomColor() {
  return gradients[Math.floor(Math.random() * gradients.length)];
}
