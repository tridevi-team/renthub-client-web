import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@shared/components/selectbox/command';
import { Command as CommandPrimitive } from 'cmdk';
import { useCallback, useRef, useState, type KeyboardEvent } from 'react';

import { Skeleton } from '@shared/components/ui/skeleton';

import { cn } from '@app/lib/utils';
import type { Option } from '@app/types';
import { Check } from 'lucide-react';

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
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
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | string | undefined>(value);
  const [inputValue, setInputValue] = useState<string | number>(value || '');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
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
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: string | number | undefined) => {
      setInputValue(selectedOption ?? '');

      setSelected(selectedOption);
      onValueChange?.(selectedOption ?? '');

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue as string}
          onValueChange={isLoading ? undefined : setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base"
        />
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
            {options.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map((option) => {
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
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
