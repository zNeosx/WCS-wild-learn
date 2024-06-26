import { Role } from '@/graphql/generated/schema';
import { Layout, Compass, List, BarChart } from 'lucide-react';

export const MIDDLEWARE_MATCH_ROUTES = [
  '/',
  '/rechercher',
  '/enseignant/:path*',
  '/auth/:path*',
];

export const APP_ROUTES = {
  [Role.STUDENT]: {
    afterLogin: '/',
    sidebarRoutes: [
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
    ],
  },
  [Role.TEACHER]: {
    afterLogin: '/enseignant/cours',
    sidebarRoutes: [
      {
        icon: List,
        label: 'Les cours',
        href: '/enseignant/cours',
      },
      {
        icon: BarChart,
        label: 'Analyse',
        href: '/enseignant/analyse',
      },
    ],
  },
  [Role.ADMIN]: {
    afterLogin: '/admin',
    sidebarRoutes: [],
  },
};
