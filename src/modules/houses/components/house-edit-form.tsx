import type { z } from '@app/lib/vi-zod';
import type { Option } from '@app/types';
import { useHouseDelete } from '@modules/houses/hooks/use-house-delete.hook';
import { housePath } from '@modules/houses/routes';
import type {
  HouseDeleteRequestSchema,
  houseUpdateRequestSchema,
  HouseUpdateResponseSchema,
} from '@modules/houses/schema/house.schema';
import { provinceRepositories } from '@shared/apis/city.api';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { Button } from '@shared/components/ui/button';
import { ConfirmationDialog } from '@shared/components/ui/confirmation-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/ui/form';
import { Input } from '@shared/components/ui/input';
import { Skeleton } from '@shared/components/ui/skeleton';
import { Textarea } from '@shared/components/ui/textarea';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { ChevronLeft, Save, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

type HouseFormProps = {
  form: ReturnType<typeof useForm<z.infer<typeof houseUpdateRequestSchema>>>;
  loading?: boolean;
  onSubmit: (
    values: z.infer<typeof houseUpdateRequestSchema>,
  ) => Promise<HouseUpdateResponseSchema>;
};

export default function HouseEditForm({
  form,
  onSubmit,
  loading,
}: HouseFormProps) {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);

  const deleteMutation = useHouseDelete();
  const onDelete = useCallback(
    async (id: HouseDeleteRequestSchema) => {
      await deleteMutation.mutateAsync(id);
      navigate(`${housePath.root}`);
    },
    [deleteMutation, navigate],
  );

  const { data: provinces, isLoading } = useSWR<Option[]>(
    '/provinces',
    async () => await provinceRepositories.city(),
  );

  const onChangeCity = useCallback(
    async (selectedCity: string | number | undefined) => {
      if (!selectedCity) {
        form.resetField('ward');
        form.resetField('district');
        setWards([]);
        setDistricts([]);
        return;
      }
      const city = provinces?.find((item) => item.value === selectedCity);
      if (city) {
        const resp = await provinceRepositories.district(city.code);
        setDistricts(resp);
      }
    },
    [provinces, form],
  );

  const onChangeDistrict = useCallback(
    async (selectedDistrict: string | number | undefined) => {
      if (!selectedDistrict) {
        setWards([]);
        form.resetField('ward');
        return;
      }
      const district = districts.find(
        (item) => item.value === selectedDistrict,
      );
      if (district) {
        const resp = await provinceRepositories.ward(district.code);
        setWards(resp);
      }
    },
    [districts, form],
  );

  const citySelected = form.watch('city');
  const districtSelected = form.watch('district');

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (citySelected && provinces) {
      onChangeCity(citySelected).then(() => {
        if (districtSelected) {
          onChangeDistrict(districtSelected);
        }
      });
    }
  }, [citySelected, provinces]);

  // Thêm một useEffect riêng để xử lý district
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (districtSelected && districts.length > 0) {
      onChangeDistrict(districtSelected);
    }
  }, [districtSelected, districts]);

  if (isLoading) {
    return <Skeleton className="h-full w-full rounded-full p-10" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-5 py-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="field-required">
                {t('house_name')}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('ph_house_name')}
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="city"
              rules={{
                required: t('common_field_required', {
                  field: t('house_city'),
                }),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_city')}</FormLabel>
                  <AutoComplete
                    value={field.value}
                    options={provinces || []}
                    onValueChange={(value) => {
                      onChangeCity(value);
                      field.onChange(value);
                    }}
                    placeholder={t('ph_house_city')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_district')}</FormLabel>
                  <AutoComplete
                    value={field.value}
                    options={districts}
                    onValueChange={(value) => {
                      onChangeDistrict(value ?? '');
                      field.onChange(value);
                    }}
                    placeholder={t('ph_house_district')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_ward')}</FormLabel>
                  <AutoComplete
                    value={field.value}
                    options={wards}
                    onValueChange={field.onChange}
                    placeholder={t('ph_house_ward')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_street')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('ph_house_street')}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="field-required">
                    {t('house_invoice_date')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('ph_house_invoice_date')}
                      inputMode="numeric"
                      prefixElement={t('meas_day')}
                      suffixElement={t('meas_each_cycle')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('house_desc_invoice_date')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="numCollectDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_num_collect_days')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('ph_house_num_collect_days')}
                      inputMode="numeric"
                      suffixElement={t('meas_day')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Kể từ ngày lập hóa đơn</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="collectionCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_collection_cycle')}</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder={t('ph_house_collection_cycle')}
                      suffixElement={t('meas_month')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_status')}</FormLabel>
                  <FormControl>
                    <AutoComplete
                      value={field.value}
                      options={[
                        { label: t('house_active'), value: 1 },
                        { label: t('house_inactive'), value: 0 },
                      ]}
                      placeholder={t('ph_house_status')}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="contractDefault"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('house_contract_default')}</FormLabel>
              <FormControl>
                <AutoComplete
                  value={field.value as string | undefined}
                  options={[]}
                  onValueChange={field.onChange}
                  placeholder={t('ph_house_contract_default')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('house_description')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('ph_house_description')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="flex justify-center space-x-2">
        <Button
          type="button"
          loading={loading}
          variant="outline"
          className="min-w-24"
          onClick={() => {
            navigate(`${housePath.root}`);
          }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('bt_back')}
        </Button>
        <ConfirmationDialog
          description={t('common_confirm_delete_message')}
          title={t('common_confirm_delete')}
          onConfirm={() => onDelete(form.getValues('id'))}
        >
          <Button
            type="button"
            variant="destructive"
            className="min-w-24"
            loading={loading}
          >
            <Trash className="mr-2 h-4 w-4" />
            {t('bt_delete')}
          </Button>
        </ConfirmationDialog>
        <Button
          type="submit"
          className="min-w-24"
          loading={loading}
          onClick={() => {
            form.handleSubmit(onSubmit);
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          {t('bt_save')}
        </Button>
      </div>
    </Form>
  );
}
