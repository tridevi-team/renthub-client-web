import { Card, CardContent } from '@shared/components/ui/card';
import type React from 'react';

export default function ContentArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-lg border-none mt-6">
      <CardContent className="p-6">
        <div className="flex min-h-[calc(0vh)]">
          <div className="w-full h-full">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}
