import { CheckCircleIcon } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { APP_ROUTE } from '@/helpers/constants';
import { useAuth } from '@/providers/GlobalProvider';

export const RegistrationSuccessPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { state } = useLocation();

  const onActionButtonClick = () => navigate(APP_ROUTE.SignIn);

  if (isLoggedIn) {
    return <Navigate to={APP_ROUTE.Dashboard} />;
  }

  return (
    <main className="grid h-[100svh] sm:h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex items-center justify-center flex-col gap-2">
        <CheckCircleIcon className="w-24 h-24 text-green-500 mb-2" />
        <p className="font-semibold text-3xl tracking-tight text-center">Almost done...</p>
        <h1 className="text-md text-muted-foreground max-w-[500px] text-center">
          {`An email with account activation link has been sent to ${state?.key ?? '-'}.`}
        </h1>
        <Button type="button" variant="link" onClick={onActionButtonClick}>
          Go to Sign In &rarr;
        </Button>
      </div>
    </main>
  );
};
