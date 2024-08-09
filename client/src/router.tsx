import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { TemplatePage, TemplatesPage, TemplatesProvider } from './modules/Templates';
import { GlobalProvider } from './providers/GlobalProvider';
import { PrivateLayout } from './layouts/PrivateLayout';
import { RoleBasedIndexRoute } from './layouts/RoleBasedIndexRoute';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { UserPermission } from './services/users';
import { APP_ROUTE } from './helpers/constants';
import { DeduplicationPage, DeduplicationProvider } from './modules/DeduplicationPage';
import { OrganizationPage, OrganizationsPage, OrganizationsProvider } from './modules/Organizations';
import { DynamicRoute } from './layouts/DynamicRoute';
import { UserPage, UsersPage, UsersProvider } from './modules/Users';
import { MyProfilePage } from './modules/MyProfilePage';
import { PermissionDeniedPage } from './modules/Public/PermissionDeniedPage';
import { SignInPage } from './modules/Public/SignInPage';
import { NotFoundPage } from './modules/NotFoundPage';
import { HandbookProvider, HandbookPage, SingleHandbookPage } from './modules/HandbookPage';
import { UserHandbookListPage } from './modules/UserHandbookList';
import { RulesPage, RulesProvider } from './modules/Rules';
import { SentReferralsPage, SentReferralsProvider, SentReferralPage } from './modules/SentReferrals';
import { ReceivedReferralPage, ReceivedReferralsPage, ReceivedReferralsProvider } from './modules/ReceivedReferrals';
import { BeneficiaryReferralDataPage } from './modules/Public/BeneficiaryReferralDataPage';
import { BeneficiaryListPage, SingleBeneficiaryPage } from './modules/BeneficiaryList';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<GlobalProvider />}>
      <Route path="/" element={<PrivateLayout />}>
        <Route index element={<RoleBasedIndexRoute />} />

        {/* DEDUPLICATION */}

        <Route element={<ProtectedRoute userPermissions={[UserPermission.Deduplication]} />}>
          <Route path={APP_ROUTE.Deduplication} element={<DeduplicationProvider />}>
            <Route index element={<DeduplicationPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute userPermissions={[UserPermission.Deduplication]} />}>
          <Route path={APP_ROUTE.BeneficiaryList}>
            <Route index element={<BeneficiaryListPage />} />
            <Route path=":id" element={<DynamicRoute component={<SingleBeneficiaryPage />} />} />
          </Route>
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
            <Route path="new" element={<DynamicRoute component={<SingleHandbookPage />} />} />
          </Route>
        </Route>

        {/* OTHER */}

        <Route
          path={APP_ROUTE.Dashboard}
          element={
            <iframe
              src="https://ccd-meta.initdevelopment.com/public/dashboard/be49c8cb-7a6b-4503-b888-3cf63e51c73b"
              width="100%"
              height="100%"
            />
          }
        />
        <Route path={APP_ROUTE.UserHandbookList} element={<UserHandbookListPage />} />
        <Route path={APP_ROUTE.MyProfile} element={<DynamicRoute component={<MyProfilePage />} />} />
      </Route>

      {/* Public Pages */}
      <Route path={APP_ROUTE.ReferralData} element={<BeneficiaryReferralDataPage />} />
      <Route path={APP_ROUTE.PermissionDenied} element={<PermissionDeniedPage />} />
      <Route path={APP_ROUTE.SignIn} element={<SignInPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);
