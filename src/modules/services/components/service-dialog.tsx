import { zodResolver } from '@hookform/resolvers/zod';
import {
  serviceCreateRequestSchema,
  type ServiceCreateRequestSchema,
  type ServiceUpdateRequestSchema,
} from '@modules/services/schema/service.schema';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
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
import {
  SERVICE_MEAUSRE_UNITS,
  SERVICE_TYPE_OPTIONS,
  SERVICE_TYPES,
  TYPE_INDEX,
  TYPE_INDEX_OPTIONS,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useForm } from 'react-hook-form';

type ServiceDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: ServiceCreateRequestSchema) => void;
  onUpdate: (data: ServiceUpdateRequestSchema) => void;
  isSubmitting: boolean;
  initialData?: ServiceUpdateRequestSchema;
};

export function ServiceDialog({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  isSubmitting,
  initialData,
}: ServiceDialogProps) {
  const [t] = useI18n();
  const [mesureUnit, setMesureUnit] = useState<string>('');
  const form = useForm({
    resolver: zodResolver(serviceCreateRequestSchema),
    reValidateMode: 'onChange',
    defaultValues: initialData || {},
  });
  const selectedType = form.watch('type') || '';
  const selectedTypeIndex = form.watch('typeIndex');

  const getMesureUnit = () => {
    let type = form.getValues('type');
    const typeIndex = form.getValues('typeIndex');
    if (type === 'INDEX' && typeIndex === TYPE_INDEX.WATER_CONSUMPTION)
      type = 'WATER_CONSUMPTION';
    if (type === 'INDEX' && typeIndex === TYPE_INDEX.ELECTRICITY_CONSUMPTION)
      type = 'ELECTRICITY_CONSUMPTION';
    if (type === 'INDEX' && typeIndex === TYPE_INDEX.OTHER) type = 'OTHER';
    if (!type) return '';
    return `đ/${SERVICE_MEAUSRE_UNITS[type as keyof typeof SERVICE_MEAUSRE_UNITS] || ''}`;
  };

  useEffect(() => {
    if (initialData) {
      const { type } = initialData;
      const updatedData = { ...initialData };

      if (
        type === SERVICE_TYPES.ELECTRICITY_CONSUMPTION ||
        type === SERVICE_TYPES.WATER_CONSUMPTION
      ) {
        updatedData.type = SERVICE_TYPES.INDEX;
        updatedData.typeIndex =
          type === SERVICE_TYPES.ELECTRICITY_CONSUMPTION
            ? TYPE_INDEX.ELECTRICITY_CONSUMPTION
            : TYPE_INDEX.WATER_CONSUMPTION;
      }

      form.reset(updatedData);
    }
  }, [initialData, form]);

  useEffect(() => {
    setMesureUnit(getMesureUnit());
  }, [selectedType, selectedTypeIndex]);

  useEffect(() => {
    const formValues: any = form.getValues();
    for (const key of Object.keys(formValues) as (keyof typeof formValues)[]) {
      formValues[key] = null;
    }
    if (!isOpen) form.reset(formValues);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="min-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t('service_edit_title') : t('service_create_title')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              initialData ? (data) => onUpdate(data) : (data) => onCreate(data),
            )}
            className="space-y-4 px-2"
          >
            <Row className="gap-y-4">
              <Col xs={12}>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('service_name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={12} md={6}>
                <FormField
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('service_cal_by')}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={SERVICE_TYPE_OPTIONS}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder={t('common_ph_select', {
                            field: t('service_cal_by').toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col
                xs={12}
                md={6}
                className={`${!(selectedType === SERVICE_TYPES.INDEX) ? 'hidden' : ''}`}
              >
                <FormField
                  name="typeIndex"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('service_type_index_option')}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={TYPE_INDEX_OPTIONS}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder={t('common_ph_select', {
                            field: t(
                              'service_type_index_option',
                            ).toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={12} md={selectedType !== SERVICE_TYPES.INDEX ? 6 : 12}>
                <FormField
                  name="unitPrice"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('service_unit_price')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          inputMode="numeric"
                          suffixElement={mesureUnit}
                          placeholder={t('common_ph_input', {
                            field: t('service_unit_price').toLocaleLowerCase(),
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={12}>
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('service_description')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ''}
                          placeholder={t('common_ph_input', {
                            field: t('service_description').toLocaleLowerCase(),
                          })}
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
