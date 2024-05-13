import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';

export const BeneficiariesPage = () => {
  return (
    <PageContainer
      pageTitle="Beneficiary List"
      pageSubtitle="Manage beneficiaries"
      breadcrumbs={[{ href: `${APP_ROUTE.Beneficiaries}`, name: 'Beneficiaries' }]}
    >
      <div></div>
    </PageContainer>
  );
};
