import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { TemplatePage, TemplatesPage, TemplatesProvider } from './modules/Templates';
import { GlobalProvider } from './providers/GlobalProvider';
import { PrivateLayout } from './layouts/PrivateLayout';
import { RoleBasedIndexRoute } from './layouts/RoleBasedIndexRoute';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { UserPermission } from './services/users';
import { APP_ROUTE } from './helpers/constants';
import { BeneficiaryListPage } from './modules/BeneficiaryListPage';
import { DeduplicationPage } from './modules/DeduplicationPage';
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
import { SentReferralsPage, SentReferralsProvider, SentReferralPage } from './modules/SentReferrals';
import { ReceivedReferralPage, ReceivedReferralsPage, ReceivedReferralsProvider } from './modules/ReceivedReferrals';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<GlobalProvider />}>
      <Route path="/" element={<PrivateLayout />}>
        <Route index element={<RoleBasedIndexRoute />} />

        {/* DEDUPLICATION */}

        <Route element={<ProtectedRoute userPermissions={[UserPermission.Deduplication]} />}>
          <Route path={APP_ROUTE.Deduplication} element={<DeduplicationPage />} />
        </Route>

        <Route element={<ProtectedRoute userPermissions={[UserPermission.Deduplication]} />}>
          <Route path={APP_ROUTE.BeneficiaryList} element={<BeneficiaryListPage />} />
        </Route>

        <Route element={<ProtectedRoute userPermissions={[UserPermission.Deduplication]} />}>
          <Route path={APP_ROUTE.Templates} element={<TemplatesProvider />}>
            <Route index element={<TemplatesPage />} />
            <Route path=":id" element={<DynamicRoute component={<TemplatePage />} />} />
          </Route>
        </Route>

        {/* REFERRALS */}

        <Route element={<ProtectedRoute userPermissions={[UserPermission.Referrals]} />}>
          <Route path={APP_ROUTE.ReceivedReferrals} element={<ReceivedReferralsProvider />}>
            <Route index element={<ReceivedReferralsPage />} />
            <Route path=":id" element={<DynamicRoute component={<ReceivedReferralPage />} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute userPermissions={[UserPermission.Referrals]} />}>
          <Route path={APP_ROUTE.SentReferrals} element={<SentReferralsProvider />}>
            <Route index element={<SentReferralsPage />} />
            <Route path=":id" element={<DynamicRoute component={<SentReferralPage />} />} />
            <Route path="new" element={<DynamicRoute component={<SentReferralPage />} />} />
          </Route>
        </Route>

        {/* ADMIN */}

        <Route element={<ProtectedRoute />}>
          <Route path={APP_ROUTE.Organizations} element={<OrganizationsProvider />}>
            <Route index element={<OrganizationsPage />} />
            <Route path=":id" element={<DynamicRoute component={<OrganizationPage />} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={APP_ROUTE.Users} element={<UsersProvider />}>
            <Route index element={<UsersPage />} />
            <Route path=":id" element={<DynamicRoute component={<UserPage />} />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={APP_ROUTE.Rules} element={<RulesProvider />}>
            <Route index element={<RulesPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={APP_ROUTE.Handbook} element={<HandbookProvider />}>
            <Route index element={<HandbookPage />} />
            <Route path=":id" element={<DynamicRoute component={<SingleHandbookPage />} />} />
          </Route>
        </Route>

        {/* OTHER */}

        <Route path={APP_ROUTE.UserHandbookList} element={<UserHandbookListPage />} />
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
