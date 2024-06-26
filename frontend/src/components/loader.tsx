import { Loader2 } from 'lucide-react';
import AuthLayout from './auth-layout';

export const Loader = () => {
  return (
    <AuthLayout>
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          <span className="">Chargement en cours...</span>
        </div>
      </div>
    </AuthLayout>
  );
};
