import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/providers/GlobalProvider';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { APP_ROUTE } from '@/helpers/constants';
import { useAuthMutation } from '@/services/auth';

export const ActivateAccountPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryActivationCode = searchParams.get('code') ?? '';
  const queryEmail = searchParams.get('email') ?? '';

  const { isLoggedIn, updateUser } = useAuth();
  const { activateAccount } = useAuthMutation();

  const onSubmit = async () => {
    const data = await activateAccount.mutateAsync({
      activationCode: queryActivationCode,
      email: queryEmail,
    });
    if (data.user) {
      updateUser(data.user);
    }
    navigate(APP_ROUTE.SignIn);
    toast({
      title: 'Activation successful!',
      variant: 'default',
      description: 'Your account is ready',
    });
  };

  return (
    <PublicPage
      title="Activate your account"
      subtitle="Click on the button below to start using your account"
      showLink
      linkLabel={`Back to ${isLoggedIn ? 'Dashboard' : 'Sign In'}`}
      linkNavigateTo={isLoggedIn ? '/' : APP_ROUTE.SignIn}
    >
      {searchParams.has('code') ? (
        <Button
          isLoading={activateAccount.isLoading}
          disabled={activateAccount.isLoading || isLoggedIn}
          onClick={onSubmit}
          type="submit"
          size="lg"
        >
          {isLoggedIn ? 'Activated' : 'Activate'}
        </Button>
      ) : (
        <Button disabled variant="destructive">
          Invalid activation code
        </Button>
      )}
    </PublicPage>
  );
};
