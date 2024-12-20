import { z } from '@app/lib/vi-zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import dayjs from 'dayjs';
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

export function ExtendContractDialog({
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
        rentalStartDate: z.string().or(z.date()),
        rentalEndDate: z.string().or(z.date()),
      }),
    ),
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        rentalStartDate: initialData.rentalEndDate,
        rentalEndDate: dayjs(initialData.rentalEndDate).add(1, 'y').toDate(),
      });
    }
  }, [initialData, form]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('contract_extend_title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2"
          >
            <Row>
              <Col xs={12} sm={6}>
                <FormField
                  name="rentalStartDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contract_new_start_date')}</FormLabel>
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
              <Col xs={12} sm={6}>
                <FormField
                  name="rentalEndDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contract_new_end_date')}</FormLabel>
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
            </Row>
            <DialogFooter>
              <Button type="button" onClick={onClose} variant="outline">
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
