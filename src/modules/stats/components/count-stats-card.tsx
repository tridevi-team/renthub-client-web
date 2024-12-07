import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { formatCurrency } from '@shared/utils/helper.util';
import type { LucideIcon } from 'lucide-react';

type CountStatsCardProps = {
  titleCard: string;
  icon?: LucideIcon;
  amount: number;
  isCurrency?: boolean;
  description?: string;
};

export const CountStatsCard = ({
  titleCard,
  icon: Icon,
  amount,
  isCurrency = false,
  description,
}: CountStatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{titleCard}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">
          {isCurrency ? formatCurrency(amount) : amount}
        </div>
        {description && (
          <p className="mt-2 text-muted-foreground text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
