import { Compass, Layout } from 'lucide-react';
import { SidebarItem } from './sidebar-item';

const guestRoutes = [
  {
    icon: Layout,
    label: 'Tableau de bord',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Rechercher',
    href: '/rechercher',
  },
];
const SidebarRoutes = () => {
  const routes = guestRoutes;

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
