import type { DataTableFilterField, DataTableFilterOption } from '@app/types';
import { PlusIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

import { cn } from '@app/lib/utils';
import { DataTableViewOptions } from '@shared/components/data-table/data-table-view-options';
import { DataTableFilterCombobox } from '@shared/components/data-table/filters/data-table-filter-combobox';
import { Button } from '@shared/components/ui/button';

import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Filter } from 'lucide-react';
import { DataTableFilterItem } from './data-table-filter-item';
import { DataTableMultiFilter } from './data-table-multi-filter';

interface DataTableAdvancedToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  const [searchParams, _] = useSearchParams();
  const [t] = useI18n();

  const options = React.useMemo<DataTableFilterOption<TData>[]>(() => {
    return filterFields.map((field) => {
      return {
        id: crypto.randomUUID(),
        label: field.label,
        value: field.value,
        options: field.options ?? [],
      };
    });
  }, [filterFields]);

  const initialSelectedOptions = React.useMemo(() => {
    return options
      .filter((option) => searchParams.get(option.value as string))
      .map((option) => {
        const value = searchParams.get(String(option.value)) as string;
        const [filterValue] = value?.split('~').filter(Boolean) ?? [];

        return {
          ...option,
          filterValues: filterValue?.split('.') ?? [],
        };
      });
  }, [options, searchParams]);

  const [selectedOptions, setSelectedOptions] = React.useState<
    DataTableFilterOption<TData>[]
  >(initialSelectedOptions);
  const [openFilterBuilder, setOpenFilterBuilder] = React.useState(
    initialSelectedOptions.length > 0 || false,
  );
  const [openCombobox, setOpenCombobox] = React.useState(false);

  function onFilterComboboxItemSelect() {
    setOpenFilterBuilder(true);
    setOpenCombobox(true);
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-2.5 overflow-auto py-1',
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 justify-between items-center space-x-2">
        {children}
        <div className="ml-auto flex items-center gap-2">
          {(options.length > 0 && selectedOptions.length > 0) ||
          openFilterBuilder ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenFilterBuilder(!openFilterBuilder)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('bt_filter')}
            </Button>
          ) : (
            <DataTableFilterCombobox
              options={options.filter(
                (option) =>
                  !selectedOptions.some(
                    (selectedOption) => selectedOption.value === option.value,
                  ),
              )}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              onSelect={onFilterComboboxItemSelect}
            />
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div
        className={cn(
          'flex items-center gap-2',
          !openFilterBuilder && 'hidden',
        )}
      >
        {selectedOptions
          .filter((option) => !option.isMulti)
          .map((selectedOption) => (
            <DataTableFilterItem
              key={String(selectedOption.value)}
              table={table}
              selectedOption={selectedOption}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              defaultOpen={openCombobox}
            />
          ))}
        {selectedOptions.some((option) => option.isMulti) ? (
          <DataTableMultiFilter
            table={table}
            allOptions={options}
            options={selectedOptions.filter((option) => option.isMulti)}
            setSelectedOptions={setSelectedOptions}
            defaultOpen={openCombobox}
          />
        ) : null}
        {options.length > 0 && options.length > selectedOptions.length ? (
          <DataTableFilterCombobox
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            onSelect={onFilterComboboxItemSelect}
          >
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className="h-7 rounded-full"
              onClick={() => setOpenCombobox(true)}
            >
              <PlusIcon className="mr-2 size-4 opacity-50" aria-hidden="true" />
              {t('common_addFilter')}
            </Button>
          </DataTableFilterCombobox>
        ) : null}
      </div>
    </div>
  );
}
