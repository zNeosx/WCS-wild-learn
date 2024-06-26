import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Props {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}

const MobileNavbarItem = ({ icon: Icon, label, href, isActive }: Props) => {
  return (
    <Link href={href} key={href} className="flex-1">
      <div className="flex flex-1 flex-col items-center gap-x-2 py-4">
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

export default MobileNavbarItem;
