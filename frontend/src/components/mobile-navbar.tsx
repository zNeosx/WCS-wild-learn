import { APP_ROUTES } from '@/constants';
import { Role } from '@/graphql/generated/schema';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import MobileNavbarItem from './mobile-navbar-item';

export const MobileNavbar = () => {
  const { pathname } = useRouter();

  const role = pathname?.includes('/enseignant')
    ? Role.TEACHER
    : pathname?.includes('/admin')
      ? Role.ADMIN
      : Role.STUDENT;

  const routes = APP_ROUTES[role].sidebarRoutes;
  return (
    <nav className="h-full flex items-center border-t shadow-sm bg-white">
      {routes.map(
        ({
          icon: Icon,
          label,
          href,
        }: {
          icon: LucideIcon;
          label: string;
          href: string;
        }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <MobileNavbarItem
              key={href}
              icon={Icon}
              label={label}
              href={href}
              isActive={isActive}
            />
          );
        }
      )}
    </nav>
  );
};
