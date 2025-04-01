import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChangelogEntry {
  id: string;
  date: Date;
  changes: string[];
  author: string;
}

interface ChangelogProps {
  changes?: ChangelogEntry[];
}

const Changelog: React.FC<ChangelogProps> = ({ changes = [] }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('common.changelog')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {changes.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {entry.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(entry.date, 'PPpp')}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {entry.changes.map((change, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {change}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {changes.length === 0 && (
              <p className="text-center text-muted-foreground">
                {t('common.no_changes')}
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Changelog; 