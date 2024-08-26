import { Info } from 'lucide-react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const RulesInformationBox = () => {
  return (
    <Alert className="w-auto mt-4">
      <Info className="h-5 w-5" color="#028493" />
      <AlertTitle className="text-xs sm:text-sm">What are rules?</AlertTitle>
      <AlertDescription className="sm:text-sm text-xs">
        Rules are lorem ipsum dolor sit amet consectetur adipisicing elit.
        Numquam quam recusandae eligendi delectus autem commodi neque similique
        iusto temporibus qui?
      </AlertDescription>
    </Alert>
  );
};
