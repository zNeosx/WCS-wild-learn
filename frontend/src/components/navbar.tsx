import Link from 'next/link';
import { NavbarRoutes } from './navbar-routes';
import Logo from './logo';
import { UserMenu } from './user-menu';
import { Badge } from './ui/badge';
import { useGetUserProfileQuery } from '@/graphql/generated/schema';
import { Loader2 } from 'lucide-react';

export const Navbar = () => {
  const getUserProfileQuery = useGetUserProfileQuery();

  if (getUserProfileQuery.loading)
    return <Loader2 className="animate-spin h-8 w-8" />;
  if (getUserProfileQuery.error) return <p>Erreur</p>;

  const profile = getUserProfileQuery.data?.getUserProfile;

  if (!profile) return null;

  return (
    <div className="p-4 border-b h-full flex items-center justify-between bg-white shadow-sm">
      <Link href={'/'} className="md:hidden">
        <Logo />
      </Link>
      <div className="ml-auto flex items-center gap-3">
        <Badge>{profile.role}</Badge>
        <UserMenu profile={profile} />
      </div>
    </div>
  );
};
