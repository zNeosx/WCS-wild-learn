import Image from 'next/image';
import { Inter } from 'next/font/google';
import AuthLayout from '@/components/auth-layout';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <AuthLayout>
      <h1 className="text-3xl font-medium text-sky-700">Hello world</h1>
    </AuthLayout>
  );
}
