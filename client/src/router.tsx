import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';

import { GlobalProvider } from '@/providers/GlobalProvider';
import { PrivateLayout } from '@/layouts/PrivateLayout';
import { NotFound } from '@/modules/NotFound';
import { APP_ROUTE } from '@/helpers/constants';
import { SignInPage } from '@/modules/Public/SignInPage';
import { Dashboard } from '@/modules/Dashboard';
import { MyProfilePage } from '@/modules/MyProfilePage';
import { DynamicRoute } from '@/layouts/DynamicRoute';

import { ForgotPasswordPage } from '@/modules/Public/ForgotPasswordPage';
import { PasswordResetPage } from '@/modules/Public/PasswordResetPage';
import { SuccessPage } from '@/modules/Public/SuccessPage/SuccessPage';
import { PermissionDenied } from '@/modules/Public/PermissionDenied';
import { Referrals } from '@/modules/Referrals';
import { Deduplication } from '@/modules/Deduplication';
import { Beneficiaries } from '@/modules/Beneficiaries';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<GlobalProvider />}>
      <Route path="/" element={<PrivateLayout />}>
        <Route index element={<Navigate to={APP_ROUTE.Dashboard} replace />} />
        <Route path={APP_ROUTE.Dashboard} element={<Dashboard />} />
        <Route path={APP_ROUTE.Beneficiaries} element={<Beneficiaries />} />
        <Route path={APP_ROUTE.Deduplication} element={<Deduplication />} />
        <Route path={APP_ROUTE.Referrals} element={<Referrals />} />
        {/* <Route element={<ProtectedRoute rolesAllowed={[UserRole.Owner]} />}>
          <Route path={APP_ROUTE.Users} element={<UsersPage />} />
        </Route> */}
        <Route path={APP_ROUTE.MyProfile} element={<DynamicRoute component={<MyProfilePage />} />} />
      </Route>

      {/* Public Pages */}
      <Route path={APP_ROUTE.PermissionDenied} element={<PermissionDenied />} />
      <Route path={APP_ROUTE.SuccessPage} element={<SuccessPage />} />
      <Route path={APP_ROUTE.SignIn} element={<SignInPage />} />
      <Route path={APP_ROUTE.ForgotPassword} element={<ForgotPasswordPage />} />
      <Route path={APP_ROUTE.ResetPassword} element={<PasswordResetPage />} />
      <Route path="*" element={<NotFound />} />
      {/* <Route path={APP_ROUTE.Register} element={<RegisterPage />} /> */}
      {/* <Route path={APP_ROUTE.RegistrationSuccess} element={<RegistrationSuccessPage />} /> */}
      {/* <Route path={APP_ROUTE.ActivateAccount} element={<ActivateAccountPage />} /> */}
      {/* <Route path={APP_ROUTE.UserPasswordSetup} element={<UserPasswordSetupPage />} /> */}
    </Route>,
  ),
);
