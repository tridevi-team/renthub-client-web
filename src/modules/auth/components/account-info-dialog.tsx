import type { Option } from '@app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type UpdateUserInfoRequestSchema,
  updateUserInfoRequestSchema,
  type UserInfoResponseSchema,
} from '@modules/auth/schemas/auth.schema';
import { provinceRepositories } from '@shared/apis/city.api';
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
import { Input } from '@shared/components/ui/input';
import { ScrollArea } from '@shared/components/ui/scroll-area';
import { GENDER_OPTIONS } from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

export function AccountInfoDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  userResponse,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserInfoRequestSchema) => void;
  isLoading: boolean;
  userResponse: UserInfoResponseSchema | null;
}) {
  const [t] = useI18n();
  const user = userResponse?.data;
  const form = useForm({
    resolver: zodResolver(updateUserInfoRequestSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      city: '',
      district: '',
      ward: '',
      street: '',
      birthday: user?.birthday ? new Date(user.birthday) : new Date(),
      gender: user?.gender || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);

  const { data: provinces } = useSWR('/provinces', provinceRepositories.city);

  const onChangeCity = useCallback(
    async (selectedCity: string | undefined | number) => {
      form.setValue('district', '');
      form.setValue('ward', '');
      setDistricts([]);
      setWards([]);
      if (selectedCity) {
        const city = provinces?.find((item) => item.value === selectedCity);
        if (city) {
          const resp = await provinceRepositories.district(city.code);
          setDistricts(resp);
        }
      }
    },
    [form, provinces],
  );

  const onChangeDistrict = useCallback(
    async (selectedDistrict: string | undefined | number) => {
      form.setValue('ward', '');
      setWards([]);
      if (selectedDistrict) {
        const district = districts.find(
          (item) => item.value === selectedDistrict,
        );
        if (district) {
          const resp = await provinceRepositories.ward(district.code);
          setWards(resp);
        }
      }
    },
    [form, districts],
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (districtSelected && districts.length > 0) {
      onChangeDistrict(districtSelected);
    }
  }, [districtSelected, districts]);

  useEffect(() => {
    if (userResponse) {
      const userData = userResponse.data;
      form.reset({
        fullName: userData.fullName || '',
        email: userData.email || '',
        city: '',
        district: '',
        ward: '',
        street: '',
        birthday: userData.birthday ? new Date(userData.birthday) : new Date(),
        gender: userData.gender || '',
        phoneNumber: userData.phoneNumber || '',
      });

      if (userData.address) {
        const { city, district, ward, street } = userData.address;
        form.setValue('city', city);
        form.setValue('district', district);
        form.setValue('ward', ward);
        form.setValue('street', street);
      }
    }
  }, [userResponse, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('account_title')}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loader2 className="animate-spin content-center" />
        ) : (
          <Form {...form}>
            <ScrollArea className="max-h-[500px]">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-2"
              >
                <Row>
                  <Col xs={12} md={6}>
                    <FormField
                      name="fullName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('account_full_name')}</FormLabel>
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
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('account_email')}</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutterWidth={16}>
                  <Col xs={12} md={6}>
                    <FormField
                      name="city"
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
                  <Col xs={12} md={6}>
                    <FormField
                      name="district"
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
                </Row>
                <Row gutterWidth={16}>
                  <Col xs={12} md={6}>
                    <FormField
                      name="ward"
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
                  <Col xs={12} md={6}>
                    <FormField
                      name="street"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('account_street')}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('ph_house_street')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutterWidth={16}>
                  <Col xs={12} md={6}>
                    <FormField
                      name="birthday"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('account_birthday')}</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={new Date(field.value)}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Col>
                  <Col xs={12} md={6}>
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
                </Row>
                <Row gutterWidth={16}>
                  <Col xs={12}>
                    <FormField
                      name="phoneNumber"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('account_phone_number')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Col>
                </Row>
                <DialogFooter>
                  <Button type="submit" loading={isLoading}>
                    {t('bt_save')}
                  </Button>
                </DialogFooter>
              </form>
            </ScrollArea>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
