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
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)]">
          <div className="flex flex-col relative">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}
