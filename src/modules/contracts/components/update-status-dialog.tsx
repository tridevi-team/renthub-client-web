import { z } from '@app/lib/vi-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { Button } from '@shared/components/ui/button';
import DatePicker from '@shared/components/ui/date-picker';
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
import { Textarea } from '@shared/components/ui/textarea';
import {
  CONTRACT_STATUS_OPTIONS,
  DEPOSIT_STATUS_OPTIONS,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { useForm } from 'react-hook-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialData?: any;
};

export function UpdateContractStatusDialog({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
}: Props) {
  const [t] = useI18n();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        status: z.string(),
        depositStatus: z.string().nullable(),
        depositDate: z.string().or(z.date()).nullable(),
        note: z.string().nullable().optional(),
      }),
    ),
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('contract_edit_title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2"
          >
            <Row>
              <Col xs={12}>
                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contract_status')}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          {...field}
                          value={field.value ?? ''}
                          options={CONTRACT_STATUS_OPTIONS}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={12} sm={6}>
                <FormField
                  name="depositStatus"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contract_deposit_status')}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          {...field}
                          value={field.value ?? ''}
                          options={DEPOSIT_STATUS_OPTIONS}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={12} sm={6}>
                <FormField
                  name="depositDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contract_deposit_date')}</FormLabel>
                      <FormControl>
                        <DatePicker
                          {...field}
                          value={field.value ?? null}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={12}>
                <FormField
                  name="note"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('floor_description')}</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
            </Row>
            <DialogFooter>
              <Button type="button" onClick={onClose}>
                {t('bt_cancel')}
              </Button>
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
