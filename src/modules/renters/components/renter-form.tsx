import type { Option } from '@app/types';
import { equipmentPath } from '@modules/equipments/routes';
import type { RenterFormRequestSchema } from '@modules/renters/schema/renter.schema';
import { roomRepositories } from '@modules/rooms/apis/room.api';
import { provinceRepositories } from '@shared/apis/city.api';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { Button } from '@shared/components/ui/button';
import DatePicker from '@shared/components/ui/date-picker';
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
  GENDER_OPTIONS,
  REPRESENT_ROOM_OPTIONS,
  TEMP_REG_OPTIONS,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Col, Row } from 'antd';
import to from 'await-to-js';
import _ from 'lodash';
import { ChevronLeft, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

type EquipmentFormProps = {
  form: UseFormReturn<RenterFormRequestSchema>;
  loading?: boolean;
  onSubmit: (values: RenterFormRequestSchema) => void;
  isEdit?: boolean;
};

export function RenterForm({
  form,
  loading,
  onSubmit,
  isEdit = false,
}: EquipmentFormProps) {
  const [t] = useI18n();
  const navigate = useNavigate();

  const [roomOptions, setRoomOptions] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);

  const { data: provinces } = useSWR('/provinces', provinceRepositories.city);

  const onChangeCity = useCallback(
    async (selectedCity: string | undefined | number) => {
      if (!selectedCity) {
        form.setValue('address.district', '');
        form.setValue('address.ward', '');
        setDistricts([]);
        setWards([]);
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
    async (selectedDistrict: string | undefined | number) => {
      if (!selectedDistrict) {
        form.setValue('address.ward', '');
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

  const fetchAllRoomData = async () => {
    const [err, resp] = await to(
      roomRepositories.all({
        searchParams: {
          filters: [
            {
              field: 'rooms.status',
              operator: 'in',
              value: 'RENTED|PENDING',
            },
          ],
        },
        isSelect: true,
      }),
    );
    if (err) return setRoomOptions([]);
    if (resp) {
      setRoomOptions(
        _.orderBy(
          resp?.data?.results?.map((room: { name: string; id: string }) => ({
            label: room.name,
            value: room.id,
          })) || [],
          ['label'],
          ['asc'],
        ),
      );
    }
  };

  useEffect(() => {
    fetchAllRoomData();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => {
          console.log('form', form.formState.errors);
        })}
        className="space-y-4 px-2"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renter_name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('common_ph_input', {
                        field: t('renter_name').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={8}>
            <FormField
              control={form.control}
              name="citizenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renter_citizen_id')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('common_ph_input', {
                        field: t('renter_citizen_id').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={8}>
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renter_room')}</FormLabel>
                  <AutoComplete
                    options={roomOptions}
                    value={
                      typeof field.value === 'string' ||
                      typeof field.value === 'number'
                        ? field.value
                        : ''
                    }
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('renter_room').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              name="address.city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_city')}</FormLabel>
                  <AutoComplete
                    value={field.value}
                    options={provinces || []}
                    onValueChange={(value) => {
                      field.onChange(value);
                      onChangeCity(value);
                    }}
                    placeholder={t('ph_user_city')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              name="address.district"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_district')}</FormLabel>
                  <AutoComplete
                    value={field.value}
                    options={districts}
                    onValueChange={(value) => {
                      field.onChange(value);
                      onChangeDistrict(value);
                    }}
                    placeholder={t('ph_user_district')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              name="address.ward"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_ward')}</FormLabel>
                  <AutoComplete
                    value={field.value}
                    options={wards}
                    onValueChange={field.onChange}
                    placeholder={t('ph_user_ward')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              name="address.street"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_street')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('ph_house_street')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={
                        typeof field.value === 'string' ||
                        typeof field.value === 'number'
                          ? field.value
                          : ''
                      }
                      placeholder={t('common_ph_input', {
                        field: t('renter_email').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_phone_number')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('common_ph_input', {
                        field: t('account_phone_number').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              name="birthday"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_birthday')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('account_gender')}</FormLabel>
                  <AutoComplete
                    value={field.value}
                    options={GENDER_OPTIONS}
                    onValueChange={field.onChange}
                    placeholder={t('ph_user_gender')}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              name="represent"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renter_represent')}</FormLabel>
                  <AutoComplete
                    value={
                      typeof field.value === 'boolean'
                        ? String(field.value)
                        : field.value || ''
                    }
                    options={REPRESENT_ROOM_OPTIONS}
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('renter_represent').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={8}>
            <FormField
              name="tempReg"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renter_temp_reg')}</FormLabel>
                  <AutoComplete
                    value={
                      typeof field.value === 'boolean'
                        ? String(field.value)
                        : field.value || ''
                    }
                    options={TEMP_REG_OPTIONS}
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('renter_temp_reg').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24}>
            <FormField
              name="note"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renter_note')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('renter_note'),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} className="mt-5">
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                loading={loading}
                variant="outline"
                className="min-w-24"
                onClick={() => {
                  navigate(`${equipmentPath.root}`);
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
          </Col>
        </Row>
      </form>
    </Form>
  );
}
