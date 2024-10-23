import type { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Button } from '@shared/components/ui/button';
import { ConfirmationDialog } from '@shared/components/ui/confirmation-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';

export interface Action<TData> {
  label: string;
  icon: React.ReactNode;
  onClick: (row: Row<TData>) => void | Promise<void>;
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
  const [open, setOpen] = useState(false);

  const handleActionClick = (action: Action<TData>) => {
    if (!action.isDanger) {
      action.onClick(row);
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('common_action')}</DropdownMenuLabel>
        {actions.map((action, index) => {
          if (action.isDanger) {
            return (
              <ConfirmationDialog
                key={`${action.label}-${index}`}
                description={t('common_confirmDeleteMessage')}
                title={t('common_confirmDelete')}
                onConfirm={async () => {
                  await action.onClick(row);
                }}
              >
                <DropdownMenuItem
                  onSelect={(event) => event.preventDefault()}
                  className="text-red-600"
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              </ConfirmationDialog>
            );
          }
          return (
            <DropdownMenuItem
              key={`${action.label}-${index}`}
              onSelect={(event) => {
                event.preventDefault();
                handleActionClick(action);
              }}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
