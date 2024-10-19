import type { DataTableFilterOption } from '@app/types';
import { ChevronDownIcon, PlusIcon, TextIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '@shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Filter } from 'lucide-react';

interface DataTableFilterComboboxProps<TData> {
  options: DataTableFilterOption<TData>[];
  selectedOptions: DataTableFilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >;
  onSelect: () => void;
  children?: React.ReactNode;
}

export function DataTableFilterCombobox<TData>({
  options,
  selectedOptions,
  setSelectedOptions,
  onSelect,
  children,
}: DataTableFilterComboboxProps<TData>) {
  const [t] = useI18n();
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<
    DataTableFilterOption<TData>
  >(options[0] ?? ({} as DataTableFilterOption<TData>));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ?? (
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t('common_filter')}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="end">
        <Command>
          <CommandInput placeholder={t('common_filterBy')} />
          <CommandList>
            <CommandEmpty>{t('common_noResultFound')}</CommandEmpty>
            <CommandGroup>
              {options
                .filter(
                  (option) =>
                    !selectedOptions.some(
                      (selectedOption) => selectedOption.value === option.value,
                    ),
                )
                .map((option) => (
                  <CommandItem
                    key={String(option.value)}
                    className="capitalize"
                    value={String(option.value)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      setSelectedOption(option);
                      setSelectedOptions((prev) => {
                        return [...prev, { ...option }];
                      });
                      onSelect();
                    }}
                  >
                    {option.options.length > 0 ? (
                      <ChevronDownIcon
                        className="mr-2 size-4"
                        aria-hidden="true"
                      />
                    ) : (
                      <TextIcon className="mr-2 size-4" aria-hidden="true" />
                    )}
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  setSelectedOptions([
                    ...selectedOptions,
                    {
                      id: crypto.randomUUID(),
                      label: selectedOption?.label ?? '',
                      value: selectedOption?.value ?? '',
                      options: selectedOption?.options ?? [],
                      isMulti: true,
                    },
                  ]);
                  onSelect();
                }}
              >
                <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                {t('common_addFilter')}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
