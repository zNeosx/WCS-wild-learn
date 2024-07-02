import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default async function uploadFile(file: File) {
  const data = new FormData();
  data.append('file', file);
  const res = await axios.post<{ url: string }>(
    'http://localhost:8000/uploads',
    data
  );
  return res.data.url;
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};
