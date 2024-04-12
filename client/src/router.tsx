import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';

import { GlobalProvider } from '@/providers/GlobalProvider';
import { PrivateLayout } from '@/layouts/PrivateLayout';
import { NotFoundPage } from '@/modules/NotFoundPage';
import { APP_ROUTE } from '@/helpers/constants';
import { SignInPage } from '@/modules/Public/SignInPage';
import { DashboardPage } from '@/modules/DashboardPage';
import { MyProfilePage } from '@/modules/MyProfilePage';
import { DynamicRoute } from '@/layouts/DynamicRoute';
import { ForgotPasswordPage } from '@/modules/Public/ForgotPasswordPage';
import { PasswordResetPage } from '@/modules/Public/PasswordResetPage';
import { SuccessPage } from '@/modules/Public/SuccessPage/SuccessPage';
import { PermissionDeniedPage } from '@/modules/Public/PermissionDeniedPage';
import { ReferralsPage } from '@/modules/ReferralsPage';
import { DeduplicationPage } from '@/modules/DeduplicationPage';
import { BeneficiariesPage } from '@/modules/BeneficiariesPage';
import { ProtectedRoute } from '@/layouts/ProtectedRoute';
import { UserRole } from '@/services/users';
import { BeneficiaryAttributesPage } from '@/modules/BeneficiaryAttributesPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<GlobalProvider />}>
      <Route path="/" element={<PrivateLayout />}>
        <Route index element={<Navigate to={APP_ROUTE.Dashboard} replace />} />
        <Route path={APP_ROUTE.Dashboard} element={<DashboardPage />} />

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User]} />}>
          <Route path={APP_ROUTE.Beneficiaries} element={<BeneficiariesPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User]} />}>
          <Route path={APP_ROUTE.Deduplication} element={<DeduplicationPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User]} />}>
          <Route path={APP_ROUTE.Referrals} element={<ReferralsPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.Admin]} />}>
          <Route path={APP_ROUTE.BeneficiaryAttributes} element={<BeneficiaryAttributesPage />} />
        </Route>
        {/* <Route element={<ProtectedRoute rolesAllowed={[UserRole.Owner]} />}>
          <Route path={APP_ROUTE.Users} element={<UsersPage />} />
        </Route> */}
        <Route path={APP_ROUTE.MyProfile} element={<DynamicRoute component={<MyProfilePage />} />} />
      </Route>

      {/* Public Pages */}
      <Route path={APP_ROUTE.PermissionDenied} element={<PermissionDeniedPage />} />
      <Route path={APP_ROUTE.SuccessPage} element={<SuccessPage />} />
      <Route path={APP_ROUTE.SignIn} element={<SignInPage />} />
      <Route path={APP_ROUTE.ForgotPassword} element={<ForgotPasswordPage />} />
      <Route path={APP_ROUTE.ResetPassword} element={<PasswordResetPage />} />
      <Route path="*" element={<NotFoundPage />} />
      {/* <Route path={APP_ROUTE.Register} element={<RegisterPage />} /> */}
      {/* <Route path={APP_ROUTE.RegistrationSuccess} element={<RegistrationSuccessPage />} /> */}
      {/* <Route path={APP_ROUTE.ActivateAccount} element={<ActivateAccountPage />} /> */}
      {/* <Route path={APP_ROUTE.UserPasswordSetup} element={<UserPasswordSetupPage />} /> */}
    </Route>,
  ),
);
