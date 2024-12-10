// components/ProtectedRoute.tsx
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  // Si no hay usuario, redirige a la página de login
  if (!user) {
    redirect('/auth/login');
  }

  return <>{children}</>;
};

export default ProtectedRoute;
