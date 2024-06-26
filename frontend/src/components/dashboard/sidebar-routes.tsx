import { APP_ROUTES } from '@/constants';
import { Role } from '@/graphql/generated/schema';
import { useRouter } from 'next/router';
import { SidebarItem } from './sidebar-item';

const SidebarRoutes = () => {
  const { pathname } = useRouter();

  const role = pathname?.includes('/enseignant')
    ? Role.TEACHER
    : pathname?.includes('/admin')
      ? Role.ADMIN
      : Role.STUDENT;

  const routes = APP_ROUTES[role].sidebarRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
