import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons';
import type { Column } from '@tanstack/react-table';

import { cn } from '@app/lib/utils';
import { Button } from '@shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [t] = useI18n();
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? 'Sorted descending. Click to sort ascending.'
                : column.getIsSorted() === 'asc'
                  ? 'Sorted ascending. Click to sort descending.'
                  : 'Not sorted. Click to sort ascending.'
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-auto min-h-8 whitespace-normal text-left data-[state=open]:bg-accent"
          >
            <div className="flex items-center gap-2">
              <span className="flex-1">{title}</span>
              {column.getCanSort() && column.getIsSorted() === 'desc' ? (
                <ArrowDownIcon
                  className="size-4 flex-shrink-0"
                  aria-hidden="true"
                />
              ) : column.getIsSorted() === 'asc' ? (
                <ArrowUpIcon
                  className="size-4 flex-shrink-0"
                  aria-hidden="true"
                />
              ) : (
                <CaretSortIcon
                  className="size-4 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                {t('common_asc')}
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                {t('common_desc')}
              </DropdownMenuItem>
            </>
          )}
          {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Hide column"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeNoneIcon
                className="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              {t('common_hide')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
