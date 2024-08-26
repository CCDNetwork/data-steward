import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const DashboardPage = () => {
  const [isMetabaseLoaded, setIsMetabaseLoaded] = useState<boolean>(false);

  const onIframeLoad = () => setIsMetabaseLoaded(true);
  return (
    <div className="h-full w-full">
      {!isMetabaseLoaded && (
        <div className="w-full h-full flex flex-col justify-center items-center p-6">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}

      <iframe
        onLoad={onIframeLoad}
        className="dark:invert dark:hue-rotate-180"
        src="https://ccd-meta.initdevelopment.com/public/dashboard/be49c8cb-7a6b-4503-b888-3cf63e51c73b"
        width="100%"
        height="100%"
      />
    </div>
  );
};
