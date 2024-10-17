import * as React from 'react';

import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@shared/components/ui/drawer';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useMediaQuery } from '@shared/hooks/use-media-query';
import { Trash } from 'lucide-react';

interface ConfirmationDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  showTrigger?: boolean;
  triggerText?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  length?: number;
}

export function ConfirmationDialog({
  title,
  description,
  onConfirm,
  showTrigger = true,
  triggerText,
  confirmText,
  cancelText,
  icon = <Trash className="mr-2 size-4" aria-hidden="true" />,
  length,
  ...props
}: ConfirmationDialogProps) {
  const [t] = useI18n();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const defaultDeleteText = t('bt_delete');
  const defaultConfirmText = t('bt_confirm');
  const defaultCancelText = t('bt_cancel');

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setShowDeleteTaskDialog(false);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerButton = (
    <Button
      variant="danger"
      size="sm"
      onClick={() => setShowDeleteTaskDialog(true)}
    >
      {icon}
      {triggerText || defaultDeleteText} {length !== undefined && `(${length})`}
    </Button>
  );

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:space-x-0">
        <DialogClose asChild>
          <Button variant="outline">{cancelText || defaultCancelText}</Button>
        </DialogClose>
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={isLoading}
          loading={isLoading}
        >
          {confirmText || defaultConfirmText}
        </Button>
      </DialogFooter>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={showDeleteTaskDialog} {...props}>
        {showTrigger && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
        <DialogContent>{content}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={showDeleteTaskDialog} {...props}>
      {showTrigger && <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>}
      <DrawerContent>{content}</DrawerContent>
    </Drawer>
  );
}