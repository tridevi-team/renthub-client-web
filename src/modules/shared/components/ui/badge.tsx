import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@app/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-[#FFF2F0] text-[#FF4D4F]',
        outline: 'text-foreground',
        success: 'border-transparent bg-[#E6FFFB] text-[#1DA0A5]',
        warning: 'border-transparent bg-[#FFF2E8] text-[#D4380D]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}
export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>['variant']
>;
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
