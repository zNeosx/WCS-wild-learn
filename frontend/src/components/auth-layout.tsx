import { Inter } from 'next/font/google';
import { MobileNavbar } from './mobile-navbar';
import { Navbar } from './navbar';
import Sidebar from './sidebar';
import { Toaster } from './ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={cn(inter.className, 'h-full')}>
      <div className="h-[70px] md:h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 py-20 h-fit">
        <div className="p-4 h-fit">{children}</div>
      </main>
      <div className="h-[80px] md:hidden md:pl-56 fixed bottom-0 w-full z-50">
        <MobileNavbar />
      </div>
      <Toaster />
    </div>
  );
};

export default AuthLayout;
