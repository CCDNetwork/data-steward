import { CheckCircleIcon } from 'lucide-react';

export const SuccessPage = () => {
  // eslint-disable-next-line prefer-const
  let successMessage = 'Action successful!';

  return (
    <main className="grid animate-appear h-[100svh] sm:h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex items-center justify-center flex-col gap-2">
        <CheckCircleIcon className="w-24 h-24 text-green-500 mb-2" />
        <p className="font-semibold text-green-500">Success</p>
        <h1 className="text-3xl font-bold tracking-tight text-center">{successMessage}</h1>
        <p className="text-base leading-7 text-muted-foreground text-center">You can close this page now.</p>
      </div>
    </main>
  );
};
