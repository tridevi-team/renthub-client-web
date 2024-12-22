import type { DataTableFilterOption } from '@app/types';
import { TrashIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

import { dataTableConfig } from '@app/config/data-table.config';
import { cn } from '@app/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/data-table/select';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { useDebounce } from '@shared/hooks/use-debounce';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableAdvancedFacetedFilter } from './data-table-advanced-faceted-filter';
interface DataTableFilterItemProps<TData> {
  table: Table<TData>;
  selectedOption: DataTableFilterOption<TData>;
  selectedOptions: DataTableFilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >;
  defaultOpen: boolean;
}

export function DataTableFilterItem<TData>({
  table,
  selectedOption,
  selectedOptions,
  setSelectedOptions,
  defaultOpen,
}: DataTableFilterItemProps<TData>) {
  const [searchParams] = useSearchParams();
  const [t] = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const column = table.getColumn(
    selectedOption.value ? String(selectedOption.value) : '',
  );

  const selectedValues = new Set(
    selectedOptions.find((item) => item.value === column?.id)?.filterValues,
  );

  const filterValues = Array.from(selectedValues);
  const filterOperator = selectedOptions.find(
    (item) => item.value === column?.id,
  )?.filterOperator;

  const operators =
    selectedOption.options.length > 0
      ? dataTableConfig.selectableOperators
      : dataTableConfig.comparisonOperators;

  const [value, setValue] = React.useState(filterValues[0] ?? '');
  const debounceValue = useDebounce(value, 500);
  const [open, setOpen] = React.useState(defaultOpen);
  const [selectedOperator, setSelectedOperator] = React.useState(
    operators.find((c) => c.value === filterOperator) ?? operators[0],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    const filters = newSearchParams.getAll('filter');

    if (selectedOption.options.length > 0) {
      if (filterValues.length > 0) {
        if (selectedOperator?.value === 'in') {
          const existingFilterIndex = filters.findIndex((item) =>
            item.startsWith(
              `${String(selectedOption.value)}:${selectedOperator?.value}:`,
            ),
          );
          if (existingFilterIndex !== -1) {
            filters[existingFilterIndex] =
              `${String(selectedOption.value)}:${selectedOperator?.value}:${filterValues.join('|')}`;
          } else {
            const newFilter = `${String(selectedOption.value)}:${selectedOperator?.value}:${filterValues.join('|')}`;
            filters.push(newFilter);
          }
          newSearchParams.delete('filter');
          for (const filter of filters) {
            newSearchParams.append('filter', filter);
          }
        } else {
          for (const value of filterValues) {
            const newFilter = `${String(selectedOption.value)}:${selectedOperator?.value}:${value}`;
            if (!filters.includes(newFilter)) {
              filters.push(newFilter);
            }
            newSearchParams.append('filter', newFilter);
          }
        }
      }
    } else {
      if (debounceValue.length > 0) {
        const newFilter = `${String(selectedOption.value)}:${selectedOperator?.value}:${debounceValue}`;
        if (!filters.includes(newFilter)) {
          filters.push(newFilter);
        }
        newSearchParams.delete('filter');
        for (const filter of filters) {
          newSearchParams.append('filter', filter);
        }
      }
    }

    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  }, [selectedOption, debounceValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-7 gap-0 truncate rounded-full',
            (selectedValues.size > 0 || value.length > 0) && 'bg-muted/50',
          )}
        >
          <span className="font-medium capitalize">{selectedOption.label}</span>
          {selectedOption.options.length > 0
            ? selectedValues.size > 0 && (
                <span className="text-muted-foreground">
                  <span className="text-foreground">: </span>
                  {selectedValues.size > 2
                    ? `${selectedValues.size} selected`
                    : selectedOption.options
                        .filter((item) => selectedValues.has(item.value))
                        .map((item) => item.label)
                        .join(', ')}
                </span>
              )
            : value.length > 0 && (
                <span className="text-muted-foreground">
                  <span className="text-foreground">: </span>
                  {value}
                </span>
              )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 space-y-1.5 p-2" align="start">
        <div className="flex items-center space-x-1 pr-0.5 pl-1">
          <div className="flex flex-1 items-center space-x-1">
            <div className="text-muted-foreground text-xs capitalize">
              {selectedOption.label}
            </div>
            <Select
              value={selectedOperator?.value}
              onValueChange={(value) =>
                setSelectedOperator(
                  operators.find((c) => c.value === value) ?? operators[0],
                )
              }
            >
              <SelectTrigger className="h-auto w-fit truncate border-none px-2 py-0.5 text-xs hover:bg-muted/50">
                <SelectValue placeholder={selectedOperator?.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {operators.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="py-1"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            aria-label="Remove filter"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground"
            onClick={() => {
              setSelectedOptions((prev) =>
                prev.filter((item) => item.value !== selectedOption.value),
              );
              const newSearchParams = new URLSearchParams(searchParams);
              const filters = newSearchParams.getAll('filter');
              const updatedFilters = filters.filter(
                (f) => !f.startsWith(`${String(selectedOption.value)}:`),
              );
              newSearchParams.delete('filter');
              for (const filter of updatedFilters) {
                newSearchParams.append('filter', filter);
              }
              navigate(`${location.pathname}?${newSearchParams.toString()}`, {
                replace: true,
              });
            }}
          >
            <TrashIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {selectedOption.options.length > 0 ? (
          column && (
            <DataTableAdvancedFacetedFilter
              key={String(selectedOption.value)}
              column={column}
              title={selectedOption.label}
              options={selectedOption.options}
              selectedValues={selectedValues}
              setSelectedOptions={setSelectedOptions}
            />
          )
        ) : (
          <Input
            placeholder={t('common_type_here')}
            className="h-8"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
