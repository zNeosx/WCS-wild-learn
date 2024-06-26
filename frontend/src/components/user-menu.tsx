import {
  User,
  useGetUserProfileQuery,
  useLogoutMutation,
} from '@/graphql/generated/schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { cn } from '@/lib/utils';
import { BadgeCheck, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

interface Props {
  profile: User
}
export const UserMenu = ({profile}: Props) => {
  const router = useRouter();

  const [logoutMutation, logoutMutationResult] = useLogoutMutation({
    onCompleted: () => {
      // toast({
      //   icon: <BadgeCheck className="h-5 w-5" />,
      //   title: 'Déconnexion réussie',
      //   className: 'text-success',
      // });
      router.push('/auth/connexion');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleLogout = async () => {
    await logoutMutation();
  };


  const itemsClassName = 'gap-2';
  const iconsClassName = 'h-4 w-4';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            {profile?.lastName[0].toUpperCase()}
            {profile?.firstName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {profile?.firstName} {profile?.lastName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={cn(itemsClassName, 'text-error focus:text-error')}
          onClick={handleLogout}
        >
          <LogOut className={iconsClassName} />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
