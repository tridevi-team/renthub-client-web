import type { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';

interface Action<TData> {
  label: string;
  icon: React.ReactNode;
  onClick: (row: Row<TData>) => void;
  isDanger?: boolean;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: Action<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  const [t] = useI18n();
  const handleActionClick = (action: Action<TData>) => {
    action.onClick(row);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('common_action')}</DropdownMenuLabel>
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={`${action.label}-${index}`}
            onClick={() => handleActionClick(action)}
            className={action.isDanger ? 'text-red-600' : ''}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
