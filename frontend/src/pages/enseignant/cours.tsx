import AuthLayout from '@/components/auth-layout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CoursePage = () => {
  return (
    <AuthLayout>
      <Link href={'/enseignant/cours/nouveau'} className={cn(buttonVariants())}>
        Créer un cours
      </Link>
    </AuthLayout>
  );
};

export default CoursePage;
