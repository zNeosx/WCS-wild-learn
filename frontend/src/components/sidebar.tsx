import Link from 'next/link';
import SidebarRoutes from './dashboard/sidebar-routes';
import Logo from './logo';

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Link href={'/'}>
          <Logo />
        </Link>
      </div>

      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
