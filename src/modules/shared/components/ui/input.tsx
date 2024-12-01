import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { Input } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

interface CustomInputProps {
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  wrapperClassName?: string;
  customType?: string;
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    CustomInputProps {}

const _Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      prefixElement,
      suffixElement,
      wrapperClassName,
      inputMode,
      onChange,
      customType = 'text',
      ...props
    },
    ref,
  ) => {
    const [inputType, setInputType] = React.useState(customType);

    const toggleVisibility = () => {
      setInputType((prevType) =>
        prevType === 'password' ? 'text' : 'password',
      );
    };

    return (
      <div className={twMerge('relative flex items-center', wrapperClassName)}>
        {prefixElement && (
          <div className="pointer-events-none absolute left-3 flex items-center bg-white text-gray-500 text-sm">
            {prefixElement}
          </div>
        )}
        <Input
          className={twMerge(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            prefixElement && 'pl-14',
            suffixElement && 'pr-8',
            className,
          )}
          ref={ref}
          type={inputType}
          onChange={(e) => {
            if (inputMode === 'numeric') {
              const value = e.target.value;
              const numValue = value.replace(/[^0-9]/g, '');
              onChange?.({ ...e, target: { ...e.target, value: numValue } });
            } else {
              onChange?.(e);
            }
          }}
          pattern={inputMode === 'numeric' ? '[0-9]*' : undefined}
          {...props}
        />
        {suffixElement && (
          <div className="pointer-events-none absolute right-3 flex items-center bg-white pl-2 text-gray-500 text-sm">
            {suffixElement}
          </div>
        )}
        {customType === 'password' && (
          <div
            className="absolute right-3 flex cursor-pointer items-center"
            onClick={toggleVisibility}
            onKeyUp={(e) => e.key === 'Enter' && toggleVisibility()}
            role="button"
            tabIndex={0}
          >
            {inputType === 'password' ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </div>
        )}
      </div>
    );
  },
);

export { _Input as Input };
