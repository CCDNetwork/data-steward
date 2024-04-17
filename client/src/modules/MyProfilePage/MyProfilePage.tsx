import { PageContainer } from '@/components/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useUserMe } from '@/services/users/api';
import { MyProfileForm, WipeDataDialog } from '@/modules/MyProfilePage/components';
import { useAuth } from '@/providers/GlobalProvider';
import { UserRole } from '@/services/users';

export const MyProfilePage = () => {
  const {
    user: { role },
  } = useAuth();
  const { data: userProfileData, isLoading: userProfileQueryLoading } = useUserMe({ queryEnabled: true });

  return (
    <PageContainer
      pageTitle="My Profile"
      isLoading={userProfileQueryLoading}
      containerClassName="sm:p-6 p-0 pt-6"
      headerClassName="sm:px-0 px-6"
      headerNode={role === UserRole.Admin && <WipeDataDialog />}
    >
      <div className="space-y-8 pb-6 max-w-3xl">
        <Card className="sm:bg-secondary/20 border-0 sm:border sm:dark:bg-secondary/10 shadow-none">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Edit your account information here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <MyProfileForm userProfileData={userProfileData} userProfileQueryLoading={userProfileQueryLoading} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
