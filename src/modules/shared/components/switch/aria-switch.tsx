import type { SwitchProps } from 'react-aria-components';
import { Switch } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

interface MySwitchProps extends Omit<SwitchProps, 'children'> {
  children: React.ReactNode;
}

export function AriaSwitch({ children, className, ...props }: MySwitchProps) {
  return (
    <Switch
      className={(classProps) =>
        twMerge(
          'group flex items-center',
          typeof className === 'string' ? className : className?.(classProps),
        )
      }
      {...props}
    >
      <div className="group-rac- box-border flex h-5.5 w-10 shrink-0 cursor-default rounded-full border border-primary border-solid bg-white bg-clip-padding px-1 py-1.5 shadow-inner outline-none ring-black transition duration-200 ease-in-out group-rac-pressed:bg-primary-content group-rac-selected:bg-primary group-rac-focus-visible:ring">
        <span className="size-3 translate-x-0 rounded-full bg-primary shadow transition duration-200 ease-in-out group-rac-selected:translate-x-[100%] group-rac-selected:bg-white" />
      </div>

      {children}
    </Switch>
  );
}
