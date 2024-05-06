import MDEditor from '@uiw/react-md-editor';
import { formatDate } from 'date-fns';

import { useTheme } from '@/providers/ThemeProvider';
import { Handbook } from '@/services/handbooks';

export const HandbookItem = ({ content, createdAt, updatedAt, title }: Handbook) => {
  const { theme } = useTheme();

  return (
    <div className="border border-border rounded-md">
      <div className="flex flex-col sm:flex-row justify-between border-b bg-muted/30 rounded-tl-md rounded-tr-md">
        <span className="px-4 py-2">
          <label htmlFor="title" className="uppercase text-xs font-medium text-muted-foreground">
            Title
          </label>
          <p id="title" className="text-lg font-bold">
            {title}
          </p>
        </span>
        <div className="flex">
          <span className="px-4 py-2">
            <label htmlFor="createdAt" className="uppercase text-xs font-medium text-muted-foreground">
              Created At
            </label>
            <p id="createdAt" className="text-sm">
              {formatDate(createdAt ?? '', 'MMM do, yyyy - HH:mm')}
            </p>
          </span>
          <span className="px-4 py-2">
            <label htmlFor="updatedAt" className="uppercase text-xs font-medium text-muted-foreground">
              Updated At
            </label>
            <p id="updatedAt" className="text-sm">
              {formatDate(updatedAt ?? '', 'MMM do, yyyy - HH:mm')}
            </p>
          </span>
        </div>
      </div>
      <div data-color-mode={theme} className="max-h-[500px] overflow-auto">
        <MDEditor.Markdown className="rounded-md p-4" source={content} />
      </div>
    </div>
  );
};
