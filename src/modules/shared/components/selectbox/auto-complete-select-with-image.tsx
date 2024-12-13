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
import { debounce } from 'lodash';
import { Check, ChevronDown, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { unstable_batchedUpdates } from 'react-dom';

type AutoCompleteProps = {
  options: Option[];
  emptyMessage?: string;
  value?: number | string | undefined;
  onValueChange?: (value: number | string | undefined) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => Promise<Option[]>;
  debounceTime?: number;
};

export const AutoCompleteWithImage = ({
  options: initialOptions,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading: externalLoading = false,
  onSearch,
  debounceTime = 300,
}: AutoCompleteProps) => {
  const [t] = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | string | undefined>(value);
  const [inputValue, setInputValue] = useState<string | number | undefined>(
    value,
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();

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
    unstable_batchedUpdates(() => {
      setOpen(false);
      setInputValue(selected);
      setSearchValue('');
    });
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOpt: Option) => {
      unstable_batchedUpdates(() => {
        setInputValue(selectedOpt.value);
        setSearchValue('');
        setSelected(selectedOpt.value);
        setSelectedOption(selectedOpt);
        onValueChange?.(selectedOpt.value);
      });
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!onSearch) return;

      setIsSearching(true);
      try {
        const results = await onSearch(searchTerm);
        if (results?.length > 0) {
          setOptions(results);
        }
      } catch (error) {
        setOptions([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceTime),
    [onSearch],
  );

  // Clear debounced search on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = async (value: string) => {
    setSearchValue(value);
    if (!isOpen) {
      setOpen(true);
    }

    if (onSearch) {
      debouncedSearch(value);
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    unstable_batchedUpdates(() => {
      setSelected(undefined);
      setSelectedOption(undefined);
      setInputValue(undefined);
      setSearchValue('');
    });
    onValueChange?.(undefined);
    inputRef.current?.focus();
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const safeToString = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return String(value);
  };

  const filteredOptions = onSearch
    ? options
    : searchValue
      ? initialOptions.filter((option) => {
          const labelString = safeToString(option.label);
          const descriptionString = safeToString(option.description || '');
          const searchString = safeToString(searchValue).toLowerCase();
          return `${labelString} ${descriptionString}`
            .toLowerCase()
            .includes(searchString);
        })
      : initialOptions;

  useEffect(() => {
    if (!onSearch) {
      unstable_batchedUpdates(() => {
        setOptions(initialOptions);
        setSelectedOption(
          initialOptions.find((option) => option.value === value) || undefined,
        );
      });
    }
  }, [initialOptions, onSearch]);

  useEffect(() => {
    unstable_batchedUpdates(() => {
      setSelected(value);
      setInputValue(value);
      setSelectedOption(
        options.find((option) => option.value === value) || undefined,
      );
    });
  }, [value]);

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} shouldFilter={!onSearch}>
      <div className="relative">
        <CommandInput
          ref={inputRef}
          value={
            isOpen
              ? safeToString(searchValue)
              : safeToString(selectedOption?.label) || ''
          }
          onValueChange={externalLoading ? undefined : handleInputChange}
          onBlur={handleBlur}
          onFocus={() => {
            unstable_batchedUpdates(() => {
              setOpen(true);
              setSearchValue('');
            });
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8 text-sm"
        />
        {inputValue ? (
          <button
            onClick={handleClear}
            className="-translate-y-1/2 absolute top-1/2 right-2 rounded-full p-1 hover:bg-slate-100"
            type="button"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        ) : null}
        {!inputValue && (
          <ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 h-4 w-4 text-slate-500" />
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
            {externalLoading || isSearching ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {filteredOptions.length > 0 && !externalLoading && !isSearching ? (
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = selected === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={safeToString(option.label)}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                    >
                      <div className="flex w-full items-center">
                        {isSelected && <Check className="mr-2 w-4" />}
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          {option.description && (
                            <span className="text-gray-500 text-sm">
                              {option.description}
                            </span>
                          )}
                        </div>
                        {option.imageUrl && (
                          <img
                            src={option.imageUrl}
                            alt=""
                            className="ml-auto h-8"
                          />
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!externalLoading && !isSearching ? (
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
