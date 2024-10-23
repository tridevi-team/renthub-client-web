import { cn } from '@app/lib/utils';
import type { Option } from '@app/types';
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shared/components/selectbox/command';
import { Skeleton } from '@shared/components/ui/skeleton';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, X } from 'lucide-react';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';

type AutoCompleteProps = {
  options: Option[];
  emptyMessage?: string;
  value?: number | string | undefined;
  onValueChange?: (value: number | string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const [t] = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | string | undefined>(value);
  const [inputValue, setInputValue] = useState<string | number>(value || '');
  const [searchValue, setSearchValue] = useState<string>('');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      if (!isOpen) {
        setOpen(true);
      }

      if (event.key === 'Enter' && input.value !== '') {
        setSelected(input.value);
        onValueChange?.(input.value);
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [isOpen, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(selected ?? '');
    setSearchValue('');
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: string | number | undefined) => {
      setInputValue(selectedOption ?? '');
      setSearchValue('');
      setSelected(selectedOption);
      onValueChange?.(selectedOption ?? '');

      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (!isOpen) {
      setOpen(true);
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelected(undefined);
    setInputValue('');
    setSearchValue('');
    onValueChange?.('');
    inputRef.current?.focus();
  };

  const filteredOptions = searchValue
    ? options.filter((option) =>
        option.label
          .toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase()),
      )
    : options;

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div className="relative">
        <CommandInput
          ref={inputRef}
          value={isOpen ? searchValue : (inputValue as string)}
          onValueChange={isLoading ? undefined : handleInputChange}
          onBlur={handleBlur}
          onFocus={() => {
            setOpen(true);
            setSearchValue('');
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8 text-sm"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="-translate-y-1/2 absolute top-1/2 right-2 rounded-full p-1 hover:bg-slate-100"
            type="button"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        )}
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'fade-in-0 zoom-in-95 absolute top-0 z-10 w-full animate-in rounded-xl bg-white outline-none',
            isOpen ? 'block' : 'hidden',
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {filteredOptions.length > 0 && !isLoading ? (
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = selected === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label as string}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option.value)}
                      className={cn(
                        'flex w-full items-center gap-2',
                        !isSelected ? 'pl-8' : null,
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage ?? t('common_no_item')}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
