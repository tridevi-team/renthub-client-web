import { dataTableConfig } from '@app/config/data-table.config';
import type { DataTableFilterOption } from '@app/types';
import {
  CopyIcon,
  DotsHorizontalIcon,
  TextAlignCenterIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { DataTableFacetedFilter } from '@shared/components/data-table/data-table-faceted-filter';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/data-table/select';
import { Button } from '@shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import { Input } from '@shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { Separator } from '@shared/components/ui/separator';
import { useDebounce } from '@shared/hooks/use-debounce';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { Table } from '@tanstack/react-table';
import * as React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
const { selectableOperators, comparisonOperators, numberOperators } =
  dataTableConfig;

interface DataTableMultiFilterProps<TData> {
  table: Table<TData>;
  allOptions: DataTableFilterOption<TData>[];
  options: DataTableFilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >;
  defaultOpen: boolean;
}

export function DataTableMultiFilter<TData>({
  table,
  allOptions,
  options,
  setSelectedOptions,
  defaultOpen,
}: DataTableMultiFilterProps<TData>) {
  const [t] = useI18n();
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 truncate rounded-full"
        >
          <TextAlignCenterIcon className="mr-2 size-3" aria-hidden="true" />
          {options.length} rule
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 text-xs" align="start">
        <div className="space-y-2 p-4">
          {options.map((option, i) => (
            <MultiFilterRow
              key={option.id ?? i}
              i={i}
              option={option}
              table={table}
              allOptions={allOptions}
              options={options}
              setSelectedOptions={setSelectedOptions}
            />
          ))}
        </div>
        <Separator />
        <div className="p-1">
          <Button
            aria-label="Delete filter"
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              setSelectedOptions((prev) =>
                prev.filter((item) => !item.isMulti),
              );
            }}
          >
            {t('common_clear_filter')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface MultiFilterRowProps<TData> {
  i: number;
  table: Table<TData>;
  allOptions: DataTableFilterOption<TData>[];
  option: DataTableFilterOption<TData>;
  options: DataTableFilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >;
}

export function MultiFilterRow<TData>({
  i,
  table,
  option,
  allOptions,
  options,
  setSelectedOptions,
}: MultiFilterRowProps<TData>) {
  const [t] = useI18n();
  const [searchParams] = useSearchParams();
  const [value, setValue] = React.useState('');
  const debounceValue = useDebounce(value, 500);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedOption, setSelectedOption] = React.useState<
    DataTableFilterOption<TData> | undefined
  >(options[0]);

  const filterVarieties = selectedOption?.options.length
    ? selectableOperators
    : comparisonOperators;

  const [filterVariety, setFilterVariety] = React.useState(filterVarieties[0]);

  React.useEffect(() => {
    if (selectedOption?.options.length) {
      setFilterVariety(selectableOperators[0]);
    }
  }, [selectedOption?.options.length]);

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    const filters = newSearchParams.getAll('filter');

    if (debounceValue.length > 0) {
      const newFilter = `${String(selectedOption?.value)}:${filterVariety.value}:${debounceValue}`;

      if (i < filters.length) {
        filters[i] = newFilter;
      } else {
        filters.push(newFilter);
      }

      newSearchParams.delete('filter');
      for (const filter of filters) {
        newSearchParams.append('filter', filter);
      }
    } else {
      filters.splice(i, 1);
      newSearchParams.delete('filter');
      for (const filter of filters) {
        newSearchParams.append('filter', filter);
      }
    }

    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  }, [
    debounceValue,
    filterVariety,
    selectedOption?.value,
    navigate,
    location.pathname,
    searchParams,
    i,
  ]);

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={String(selectedOption?.value)}
        onValueChange={(value) => {
          setSelectedOption(
            allOptions.find((option) => option.value === value),
          );
          setSelectedOptions((prev) =>
            prev.map((item) => {
              if (item.id === option.id) {
                return {
                  ...item,
                  value: value as keyof TData,
                };
              }
              return item;
            }),
          );
        }}
      >
        <SelectTrigger className="h-8 w-full text-xs capitalize">
          <SelectValue placeholder={selectedOption?.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {allOptions.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                className="text-xs capitalize"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={filterVariety.value}
        onValueChange={(value) =>
          setFilterVariety(
            filterVarieties.find((c) => c.value === value) ??
              filterVarieties[0],
          )
        }
      >
        <SelectTrigger className="h-8 w-full truncate px-2 py-0.5 hover:bg-muted/50">
          <SelectValue placeholder={filterVarieties[0].label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filterVarieties.map((variety, index) => (
              <SelectItem
                key={`${variety.value}-${index}`}
                value={variety.value}
              >
                {variety.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedOption?.options.length ? (
        table.getColumn(selectedOption.value ? String(option.value) : '') && (
          <DataTableFacetedFilter
            key={selectedOption.id}
            column={table.getColumn(
              selectedOption.value ? String(selectedOption.value) : '',
            )}
            title={selectedOption.label}
            options={selectedOption.options}
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 shrink-0">
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setSelectedOptions((prev) =>
                prev.filter((item) => item.id !== option.id),
              );
            }}
          >
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            {t('bt_delete')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (!selectedOption) return;

              setSelectedOptions((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  label: selectedOption.label,
                  value: selectedOption.value,
                  options: selectedOption.options ?? [],
                  isMulti: true,
                },
              ]);
            }}
          >
            <CopyIcon className="mr-2 size-4" aria-hidden="true" />
            {t('bt_duplicate')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
