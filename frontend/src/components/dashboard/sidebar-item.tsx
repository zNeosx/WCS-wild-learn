import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  icon: LucideIcon;
  label: string;
  href: string;
}
export const SidebarItem = ({ icon: Icon, label, href }: Props) => {
  const router = useRouter();

  const isActive =
    router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive &&
          'text-primary bg-sky-200/20 hover:bg-sky-200/20 hover:text-primary'
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            'transition-all text-slate-500',
            isActive ? 'text-primary' : 'text-slate-500'
          )}
        />
        {label}
      </div>

      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-primary h-full transition-all',
          isActive && 'opacity-100'
        )}
      />
    </Link>
  );
};
