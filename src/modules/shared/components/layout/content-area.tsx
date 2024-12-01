import { Card, CardContent } from '@shared/components/ui/card';
import type React from 'react';

export default function ContentArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="mt-4 rounded-lg border-none">
      <CardContent className="px-6 py-4">
        <div className="flex min-h-[calc(0vh)]">
          <div className="w-full">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}
