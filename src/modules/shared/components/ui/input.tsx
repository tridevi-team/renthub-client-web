import * as React from 'react';
import { Input } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

interface CustomInputProps {
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  wrapperClassName?: string;
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    CustomInputProps {}

const _Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, prefixElement, suffixElement, wrapperClassName, ...props },
    ref,
  ) => {
    return (
      <div className={twMerge('relative flex items-center', wrapperClassName)}>
        {prefixElement && (
          <div className="pointer-events-none absolute left-3 flex items-center text-gray-500">
            {prefixElement}
          </div>
        )}
        <Input
          className={twMerge(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            prefixElement && 'pl-8',
            suffixElement && 'pr-8',
            className,
          )}
          ref={ref}
          {...props}
        />
        {suffixElement && (
          <div className="pointer-events-none absolute right-3 flex items-center text-gray-500">
            {suffixElement}
          </div>
        )}
      </div>
    );
  },
);

export { _Input as Input };
