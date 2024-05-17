import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { TemplatePage, TemplatesPage, TemplatesProvider } from './modules/Templates';
import { GlobalProvider } from './providers/GlobalProvider';
import { PrivateLayout } from './layouts/PrivateLayout';
import { RoleBasedIndexRoute } from './layouts/RoleBasedIndexRoute';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { UserRole } from './services/users';
import { APP_ROUTE } from './helpers/constants';
import { BeneficiariesPage } from './modules/BeneficiariesPage';
import { DeduplicationPage } from './modules/DeduplicationPage';
import { ReferralsPage } from './modules/ReferralsPage';
import { BeneficiaryAttributesPage } from './modules/BeneficiaryAttributesPage';
import { OrganizationPage, OrganizationsPage, OrganizationsProvider } from './modules/Organizations';
import { DynamicRoute } from './layouts/DynamicRoute';
import { UserPage, UsersPage, UsersProvider } from './modules/Users';
import { MyProfilePage } from './modules/MyProfilePage';
import { PermissionDeniedPage } from './modules/Public/PermissionDeniedPage';
import { SuccessPage } from './modules/Public/SuccessPage';
import { SignInPage } from './modules/Public/SignInPage';
import { ForgotPasswordPage } from './modules/Public/ForgotPasswordPage';
import { PasswordResetPage } from './modules/Public/PasswordResetPage';
import { NotFoundPage } from './modules/NotFoundPage';
import { HandbookProvider, HandbookPage, SingleHandbookPage } from './modules/HandbookPage';
import { UserHandbookListPage } from './modules/UserHandbookList';
import { RulesPage, RulesProvider } from './modules/Rules';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<GlobalProvider />}>
      <Route path="/" element={<PrivateLayout />}>
        <Route index element={<RoleBasedIndexRoute />} />

        {/* <Route element={<ProtectedRoute rolesAllowed={[UserRole.User]} />}>
          <Route path={APP_ROUTE.Dashboard} element={<DashboardPage />} />
        </Route> */}

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User, UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Beneficiaries} element={<BeneficiariesPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User, UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Deduplication} element={<DeduplicationPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User, UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Referrals} element={<ReferralsPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Attributes} element={<BeneficiaryAttributesPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Organizations} element={<OrganizationsProvider />}>
            <Route index element={<OrganizationsPage />} />
            <Route path=":id" element={<DynamicRoute component={<OrganizationPage />} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Users} element={<UsersProvider />}>
            <Route index element={<UsersPage />} />
            <Route path=":id" element={<DynamicRoute component={<UserPage />} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User, UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Templates} element={<TemplatesProvider />}>
            <Route index element={<TemplatesPage />} />
            <Route path=":id" element={<DynamicRoute component={<TemplatePage />} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Handbook} element={<HandbookProvider />}>
            <Route index element={<HandbookPage />} />
            <Route path=":id" element={<DynamicRoute component={<SingleHandbookPage />} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.User, UserRole.Admin]} />}>
          <Route path={APP_ROUTE.UserHandbookList} element={<UserHandbookListPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAllowed={[UserRole.Admin]} />}>
          <Route path={APP_ROUTE.Rules} element={<RulesProvider />}>
            <Route index element={<RulesPage />} />
          </Route>
        </Route>

        <Route path={APP_ROUTE.MyProfile} element={<DynamicRoute component={<MyProfilePage />} />} />
      </Route>

      {/* Public Pages */}
      <Route path={APP_ROUTE.PermissionDenied} element={<PermissionDeniedPage />} />
      <Route path={APP_ROUTE.SuccessPage} element={<SuccessPage />} />
      <Route path={APP_ROUTE.SignIn} element={<SignInPage />} />
      <Route path={APP_ROUTE.ForgotPassword} element={<ForgotPasswordPage />} />
      <Route path={APP_ROUTE.ResetPassword} element={<PasswordResetPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
