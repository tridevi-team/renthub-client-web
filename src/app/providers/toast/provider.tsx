import type { PropsWithChildren } from 'react';
import { ToastContext, createToastContext } from './context';

export function AppToastProvider({ children }: PropsWithChildren) {
  const value = createToastContext();

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}
