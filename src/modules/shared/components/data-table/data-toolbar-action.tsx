import { DownloadIcon } from '@radix-ui/react-icons';
import { Button } from '@shared/components/ui/button';
import { ConfirmationDialog } from '@shared/components/ui/confirmation-dialog';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { Table } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import type React from 'react';
interface TableToolbarActionsProps<T> {
  table: Table<T>;
  actions?: {
    onDelete?: (selectedItems: T[]) => Promise<void>;
    onCreate?: () => void;
    onDownload?: () => void;
  };
  additionalButtons?: (table: Table<T>) => React.ReactNode;
}

export function TableToolbarActions<T>({
  table,
  actions,
  additionalButtons,
}: TableToolbarActionsProps<T>) {
  const selectedItems = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  const { onDelete, onCreate, onDownload } = actions || {};
  const selectedItemsCount = selectedItems?.length;
  const [t] = useI18n();
  return (
    <div className="flex items-center gap-2">
      {onCreate && (
        <Button variant="outline" size="sm" onClick={onCreate}>
          <PlusCircle className="mr-2 size-4" aria-hidden="true" />
          {t('bt_create')}
        </Button>
      )}
      {onDelete && selectedItems.length > 0 && (
        <ConfirmationDialog
          description={t('common_confirm_delete_message')}
          title={t('common_confirm_delete')}
          length={selectedItemsCount}
          onConfirm={() => onDelete(selectedItems)}
        />
      )}
      {onDownload && (
        <Button variant="outline" size="sm" onClick={onDownload}>
          <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
          {t('bt_download')}
        </Button>
      )}
      {additionalButtons?.(table)}
    </div>
  );
}
