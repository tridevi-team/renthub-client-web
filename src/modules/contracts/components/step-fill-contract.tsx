import { zodResolver } from '@hookform/resolvers/zod';
import type { ContractTemplateSchema } from '@modules/contract-templates/schemas/contract-template.schema';
import {
  type ContractCreateFillFormRequestSchema,
  contractCreateFillFormRequestSchema,
} from '@modules/contracts/schemas/contract.schema';
import type { RoomSchema } from '@modules/rooms/schema/room.schema';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table';
import {
  DEPOSIT_STATUS_OPTIONS,
  GENDER_OPTIONS,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useLocalStorageState } from '@shared/hooks/use-local-storage-state.hook';
import { formatCurrency } from '@shared/utils/helper.util';
import { Checkbox, Col, Row, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface StepFillContract {
  roomDetail?: RoomSchema;
  selectedContractTemplate?: ContractTemplateSchema;
  setRestContractInfo: any;
  nextStep: () => void;
  prevStep: () => void;
}

const ServiceTable = ({
  services = [],
  selectedServices = [],
  setSelectedServices,
}: {
  services?: any[];
  selectedServices: any[];
  setSelectedServices: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [t] = useI18n();
  const allSelected = services && selectedServices.length === services.length;
  const isIndeterminate =
    selectedServices.length > 0 &&
    selectedServices.length < (services || []).length;
  const mesureMap = useMemo(
    () => ({
      people: t('service_type_people'),
      room: t('service_type_room'),
      water_consumption: t('service_type_index'),
      electricity_consumption: t('service_type_index'),
    }),
    [t],
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={allSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                  setSelectedServices(services || []);
                } else {
                  setSelectedServices([]);
                }
              }}
            />
          </TableHead>
          <TableHead>{t('service_index')}</TableHead>
          <TableHead>{t('service_name')}</TableHead>
          <TableHead>{t('service_description')}</TableHead>
          <TableHead>{t('service_unit_price')}</TableHead>
          <TableHead>{t('service_cal_by')}</TableHead>
          <TableHead>{t('service_start_index')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(services || []).map((service, index) => (
          <TableRow key={service.id}>
            <TableCell>
              <Checkbox
                checked={selectedServices.some((s) => s.id === service.id)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedServices((prev: any) => {
                    if (isChecked) {
                      return [...prev, service];
                    }
                    return prev.filter((s: any) => s.id !== service.id);
                  });
                }}
              />
            </TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{service.name}</TableCell>
            <TableCell>{service.description}</TableCell>
            <TableCell>{formatCurrency(service.unitPrice ?? 0)}</TableCell>
            <TableCell>
              {
                mesureMap[
                  service.type?.toLocaleLowerCase() as keyof typeof mesureMap
                ]
              }
            </TableCell>
            <TableCell>
              {service?.startIndex} {service.type === 'people' ? 'người' : ''}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const EquipmentTable = ({
  equipment,
  selectedEquipment,
  setSelectedEquipment,
}: {
  equipment?: any[];
  selectedEquipment: any[];
  setSelectedEquipment: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [t] = useI18n();
  const allSelected =
    equipment && selectedEquipment.length === equipment.length;
  const isIndeterminate =
    selectedEquipment.length > 0 &&
    selectedEquipment.length < (equipment || []).length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={allSelected}
              indeterminate={isIndeterminate}
              onChange={(e) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                  setSelectedEquipment(equipment || []);
                } else {
                  setSelectedEquipment([]);
                }
              }}
            />
          </TableHead>
          <TableHead>{t('service_index')}</TableHead>
          <TableHead>{t('equipment_name')}</TableHead>
          <TableHead>{t('equipment_code')}</TableHead>
          <TableHead>{t('equipment_status')}</TableHead>
          <TableHead>{t('equipment_shared_type')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(equipment || []).map((eq, index) => (
          <TableRow key={eq.id}>
            <TableCell>
              <Checkbox
                checked={selectedEquipment.some((s) => s.id === eq.id)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedEquipment((prev: any) => {
                    if (isChecked) {
                      return [...prev, eq];
                    }
                    return prev.filter((s: any) => s.id !== eq.id);
                  });
                }}
              />
            </TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{eq.name}</TableCell>
            <TableCell>{eq.code}</TableCell>
            <TableCell>
              {t(
                `equipment_status_${eq?.status?.toLowerCase() as 'normal' | 'broken' | 'repairing' | 'disposed'}`,
              )}
            </TableCell>
            <TableCell>
              {t(
                `equipment_shared_type_${eq.sharedType?.toLowerCase() as 'house' | 'room'}`,
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const StepFillContract = ({
  roomDetail,
  selectedContractTemplate,
  setRestContractInfo,
  nextStep,
  prevStep,
}: StepFillContract) => {
  const [t] = useI18n();
  const { equipment, services } = roomDetail || { equipment: [], services: [] };
  const [currentFormValue, setCurrentFormValue] = useLocalStorageState(
    'contract-fill-form',
    {
      defaultValue: {} as ContractCreateFillFormRequestSchema & {
        services: any[];
        equipment: any[];
      },
    },
  );
  const [selectedServices, setSelectedServices] = useState<any[]>(
    currentFormValue?.services || [],
  );
  const [selectedEquipment, setSelectedEquipment] = useState<any[]>(
    currentFormValue?.equipment || [],
  );
  const form = useForm<ContractCreateFillFormRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(contractCreateFillFormRequestSchema),
    defaultValues: currentFormValue,
  });

  useEffect(() => {
    if (selectedContractTemplate) {
      const { landlord } = selectedContractTemplate || {};
      if (!landlord) return;
      form.reset({
        landlord: {
          ...landlord,
          fullName: landlord.fullName || '',
          citizenId: landlord.citizenId || '',
          address: {
            ...landlord.address,
            city: landlord.address?.city || '',
            district: landlord.address?.district || '',
            ward: landlord.address?.ward || '',
            street: landlord.address?.street || '',
          },
          phoneNumber: landlord.phoneNumber || '',
          birthday: landlord.birthday || '',
          dateOfIssue: landlord.dateOfIssue || '',
          placeOfIssue: landlord.placeOfIssue || '',
          gender: landlord.gender || '',
          email: landlord.email || '',
        },
      });
    }
  }, [selectedContractTemplate]);

  return (
    <Form {...form}>
      <form
        className="space-y-4 px-2"
        onSubmit={form.handleSubmit((values) => {
          const restInfo = {
            ...values,
            services: selectedServices,
            equipment: selectedEquipment,
          };
          setCurrentFormValue(restInfo);
          setRestContractInfo(restInfo);
          nextStep();
        })}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <h3 className="text-bold text-lg uppercase">
              {t('contract_t_landlord')}
            </h3>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_name').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_gender')}</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={GENDER_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('common_ph_select', {
                        field: t('contract_t_ll_gender').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_phone')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_phone').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_birthday')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_city')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_city').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_district')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_district').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_ward')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_ward').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_street')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_street').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_email').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.citizenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_citizen_id').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.dateOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id_date')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.placeOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id_place')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t(
                          'contract_t_ll_citizen_id_place',
                        ).toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <hr className="mx-3 mt-2 w-full" />
          <Col xs={24}>
            <h3 className="text-bold text-lg uppercase">
              {t('contract_renter_info')}
            </h3>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_name').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_gender')}</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={GENDER_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('common_ph_select', {
                        field: t('contract_t_ll_gender').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_phone')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_phone').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_birthday')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_city')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_city').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.address.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_district')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_district').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.address.ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_ward')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_ward').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_street')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_street').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_email').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.citizenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_citizen_id').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.dateOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id_date')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <FormField
              control={form.control}
              name="renter.placeOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id_place')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t(
                          'contract_t_ll_citizen_id_place',
                        ).toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} className="mt-2">
            <hr />
          </Col>
          <Col xs={24}>
            <h3 className="text-bold text-lg uppercase">
              {t('contract_info')}
            </h3>
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={form.control}
              name="depositAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_deposit_amount')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_deposit_amount').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={form.control}
              name="depositStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_deposit_status')}</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={DEPOSIT_STATUS_OPTIONS}
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      placeholder={t('common_ph_select', {
                        field: t('contract_deposit_status').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <FormField
              control={form.control}
              name="depositDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_deposit_date')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <FormField
              control={form.control}
              name="rentalStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_rental_start_date')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <FormField
              control={form.control}
              name="rentalEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_rental_end_date')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24} className="mt-2">
            <hr />
          </Col>
          <Col xs={24}>
            <h3 className="text-bold text-lg uppercase">
              {t('contract_service')}
            </h3>
          </Col>
          <Col xs={24}>
            <ServiceTable
              services={services ?? []}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
          </Col>
          <Col xs={24} className="mt-2">
            <hr />
          </Col>
          <Col xs={24}>
            <h3 className="text-bold text-lg uppercase">
              {t('contract_equipment')}
            </h3>
          </Col>
          <Col xs={24}>
            <EquipmentTable
              equipment={equipment ?? []}
              selectedEquipment={selectedEquipment}
              setSelectedEquipment={setSelectedEquipment}
            />
          </Col>
          <Col xs={24}>
            <Space direction="horizontal">
              <Button type="button" onClick={prevStep}>
                {t('bt_back')}
              </Button>
              <Button type="submit">{t('bt_next')}</Button>
            </Space>
          </Col>
        </Row>
      </form>
    </Form>
  );
};

export default StepFillContract;
