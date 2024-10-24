import type { z } from '@app/lib/vi-zod';
import type { Option } from '@app/types';
import { housePath } from '@modules/houses/routes';
import type {
  houseCreateRequestSchema,
  HouseCreateResponseSchema,
  houseUpdateRequestSchema,
} from '@modules/houses/schema/house.schema';
import { provinceRepositories } from '@shared/apis/city.api';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { Button } from '@shared/components/ui/button';
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
import { ChevronLeft, Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

type HouseFormProps = {
  form: ReturnType<
    typeof useForm<
      z.infer<typeof houseCreateRequestSchema | typeof houseUpdateRequestSchema>
    >
  >;
  loading?: boolean;
  onSubmit: (
    values: z.infer<typeof houseCreateRequestSchema>,
  ) => Promise<HouseCreateResponseSchema>;
  isUpdate?: boolean;
};

export default function HouseForm({
  form,
  onSubmit,
  loading,
  isUpdate = false,
}: HouseFormProps) {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);

  const { data: provinces, isLoading } = useSWR<Option[]>(
    '/provinces',
    async () => await provinceRepositories.city(),
  );

  const onChangeCity = useCallback(
    async (selectedCity: string | number | undefined) => {
      if (!selectedCity) {
        setDistricts([]);
        setWards([]);
        form.resetField('district');
        form.resetField('ward');
        console.log(form.getValues());
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
        form.resetField('ward');
        setWards([]);
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
              <FormLabel>{t('house_name')}</FormLabel>
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
              name="numOfFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_num_of_floors')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('ph_house_floors')}
                      type="number"
                      {...field}
                      suffixElement={t('meas_floor')}
                    />
                  </FormControl>
                  <FormDescription>{t('house_desc_floor')}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="numOfRoomsPerFloor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_num_of_rooms_per_floor')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('ph_house_rooms_per_floor')}
                      type="number"
                      suffixElement={t('meas_room_per_floor')}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('house_desc_num_of_floors')}
                  </FormDescription>
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
              name="roomArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_room_area')}</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder={t('ph_house_area')}
                      suffixElement={t('meas_square_meter')}
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
              name="roomPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_room_price')}</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder={t('ph_house_price')}
                      suffixElement={t('meas_vnd')}
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
              name="maxRenters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('house_max_renters')}</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder={t('ph_house_max_renters')}
                      suffixElement={t('meas_person')}
                      {...field}
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
        <div className="flex justify-start space-x-2">
          <Button
            loading={loading}
            variant="outline"
            className="min-w-24"
            onClick={() => {
              navigate(`${housePath.root}/${housePath.index}`);
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('bt_back')}
          </Button>
          <Button type="submit" className="min-w-24" loading={loading}>
            <Save className="mr-2 h-4 w-4" />
            {t('bt_save')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
