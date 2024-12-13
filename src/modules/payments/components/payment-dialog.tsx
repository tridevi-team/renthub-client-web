import payOSLogo from '@assets/logo/payos.png';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  paymentMethodCreateRequestSchema,
  type PaymentMethodCreateRequestSchema,
  type PaymentMethodUpdateRequestSchema,
} from '@modules/payments/schema/payment.schema';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { AutoCompleteWithImage } from '@shared/components/selectbox/auto-complete-select-with-image';
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
import { Textarea } from '@shared/components/ui/textarea';
import { BANKS } from '@shared/constants/bank.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type PaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: PaymentMethodCreateRequestSchema) => void;
  onUpdate: (data: PaymentMethodUpdateRequestSchema) => void;
  isSubmitting: boolean;
  initialData?: PaymentMethodUpdateRequestSchema;
};

export function PaymentDialog({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  isSubmitting,
  initialData,
}: PaymentDialogProps) {
  const [t] = useI18n();
  const form = useForm({
    resolver: zodResolver(paymentMethodCreateRequestSchema),
    reValidateMode: 'onChange',
    defaultValues: initialData || {
      isDefault: 1,
      status: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      const { isDefault, status } = initialData;
      form.reset({
        ...initialData,
        isDefault: isDefault ? 1 : 0,
        status: status ? 1 : 0,
      });
    }
  }, [initialData]);

  useEffect(() => {
    const formValues: any = form.getValues();
    for (const key of Object.keys(formValues) as (keyof typeof formValues)[]) {
      formValues[key] = null;
    }
    if (!isOpen) form.reset(formValues);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="min-w-[750px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t('payment_edit_title') : t('payment_create_title')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              initialData ? (data) => onUpdate(data) : (data) => onCreate(data),
              () =>
                console.log('form.formState.errors:', form.formState.errors),
            )}
            className="space-y-4 px-2"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_name')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('common_ph_input', {
                            field: t('payment_name').toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="accountNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_account_number')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('common_ph_input', {
                            field: t(
                              'payment_account_number',
                            ).toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24}>
                <FormField
                  name="bankName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_bank_name')}</FormLabel>
                      <FormControl>
                        <AutoCompleteWithImage
                          options={BANKS.map((bank) => ({
                            value: bank.shortName,
                            label: bank.name,
                            imageUrl: bank.logo,
                            description: bank.shortName,
                          }))}
                          value={field.value ? String(field.value) : ''}
                          onValueChange={field.onChange}
                          placeholder={t('common_ph_select', {
                            field: t('payment_bank_name').toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="isDefault"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_is_default')}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={[
                            { value: 1, label: t('common_yes') },
                            { value: 0, label: t('common_no') },
                          ]}
                          value={field.value ? 1 : 0}
                          onValueChange={field.onChange}
                          placeholder={t('common_ph_select', {
                            field: t('payment_is_default').toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_status')}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={[
                            { value: 1, label: t('payment_using') },
                            { value: 0, label: t('payment_not_using') },
                          ]}
                          value={field.value ? 1 : 0}
                          onValueChange={field.onChange}
                          placeholder={t('common_ph_select', {
                            field: t('payment_status').toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24}>
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ''}
                          placeholder={t('common_ph_input', {
                            field: t('payment_description').toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24} className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {t('payment_auto_payment')}
                  </h3>
                  <span className="text-gray-500 text-sm">
                    {t('payment_payos_description')}
                  </span>
                </div>
                <img src={payOSLogo} alt="PayOS" className="h-8" />
              </Col>
              <Col xs={24}>
                <FormField
                  name="payosClientId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_payos_client_id')}</FormLabel>
                      <FormControl>
                        <Input
                          customType="password"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24}>
                <FormField
                  name="payosApiKey"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_payos_api_key')}</FormLabel>
                      <FormControl>
                        <Input
                          customType="password"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={24}>
                <FormField
                  name="payosChecksum"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('payment_payos_checksum')}</FormLabel>
                      <FormControl>
                        <Input
                          customType="password"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
            </Row>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('bt_back')}
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
