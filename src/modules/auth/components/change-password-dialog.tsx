import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordRequestSchema,
  type ChangePasswordRequestSchema,
} from '@modules/auth/schemas/auth.schema';
import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/ui/form';
import { Input } from '@shared/components/ui/input';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Col, Row } from 'react-grid-system';
import { useForm } from 'react-hook-form';

export function ChangePasswordDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordRequestSchema) => void;
  isSubmitting: boolean;
}) {
  const [t] = useI18n();
  const form = useForm({
    resolver: zodResolver(changePasswordRequestSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        form.reset();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('account_change_password_title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2"
          >
            <Row>
              <Col xs={12}>
                <FormField
                  name="oldPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('account_old_password')}</FormLabel>
                      <FormControl>
                        <Input customType="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <FormField
                  name="newPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('account_new_password')}</FormLabel>
                      <FormControl>
                        <Input customType="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('account_confirm_password')}</FormLabel>
                      <FormControl>
                        <Input customType="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
            </Row>
            <DialogFooter>
              <Button type="submit" loading={isSubmitting}>
                {t('bt_save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
