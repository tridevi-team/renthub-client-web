import type { z } from '@app/lib/vi-zod';
import { useHouseStore } from '@app/stores';
import type { Option } from '@app/types';
import { equipmentPath } from '@modules/equipments/routes';
import type {
  equipmentCreateRequestSchema,
  equipmentUpdateRequestSchema,
} from '@modules/equipments/schema/equiment.schema';
import { floorRepositories } from '@modules/floors/apis/floor.api';
import { roomRepositories } from '@modules/rooms/apis/room.api';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { Button } from '@shared/components/ui/button';
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
  EQUIPMENT_SHARED_TYPE_OPTIONS,
  EQUIPMENT_STATUS_OPTIONS,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useUpdateEffect } from '@shared/hooks/use-update-effect.hook';
import to from 'await-to-js';
import _ from 'lodash';
import { ChevronLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import type { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type EquipmentFormProps = {
  form: UseFormReturn<
    z.infer<
      typeof equipmentUpdateRequestSchema | typeof equipmentCreateRequestSchema
    >
  >;
  loading?: boolean;
  onSubmit: (
    values: z.infer<
      typeof equipmentUpdateRequestSchema | typeof equipmentCreateRequestSchema
    >,
  ) => void;
  isEdit?: boolean;
};

export function EquipmentForm({
  form,
  loading,
  onSubmit,
  isEdit = false,
}: EquipmentFormProps) {
  const [t] = useI18n();
  const navigate = useNavigate();
  const { data: selectedHouse } = useHouseStore();

  const [floorOptions, setFloorOptions] = useState<Option[]>([]);
  const [roomOptions, setRoomOptions] = useState<Option[]>([]);

  const fetchFloorData = async () => {
    const [err, floorData] = await to(
      floorRepositories.index({
        searchParams: {
          pageSize: -1,
          sorting: [
            {
              field: 'floors.name',
              direction: 'asc',
            },
          ],
        },
      }),
    );
    if (err) return setFloorOptions([]);
    if (floorData) {
      setFloorOptions(
        floorData?.data?.results?.map((floor) => ({
          label: floor.name,
          value: floor.id,
        })) || [],
      );
    }
  };

  const fetchRoomOfFloorData = async () => {
    const floorId = form.getValues('floorId');
    if (!floorId) return setRoomOptions([]);
    const [err, resp] = await to(
      roomRepositories.index({
        floorId,
        searchParams: {
          pageSize: -1,
          sorting: [
            {
              field: 'rooms.name',
              direction: 'asc',
            },
          ],
        },
        isSelect: true,
      }),
    );
    if (err) return setRoomOptions([]);
    if (resp) {
      setRoomOptions(
        resp?.data?.map((room: { name: string; id: string }) => ({
          label: room.name,
          value: room.id,
        })) || [],
      );
    }
  };

  const fetchAllRoomData = async () => {
    const [err, resp] = await to(
      roomRepositories.all({
        searchParams: {},
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

  const onChangeFloor = async (value: any) => {
    form.setValue('roomId', '');
    if (!value) return await fetchAllRoomData();
    await fetchRoomOfFloorData();
  };

  useEffect(() => {
    fetchFloorData();
    fetchAllRoomData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const floorId = form.getValues('floorId');
      if (floorId) fetchRoomOfFloorData();
    }
  }, [isEdit]);

  useUpdateEffect(() => {
    form.setValue('roomId', '');
    form.setValue('floorId', '');
    fetchFloorData();
  }, [selectedHouse]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
        <Row className="gap-y-3 px-36">
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('equipment_name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('common_ph_input', {
                        field: t('equipment_name').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('equipment_code')}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="floorId"
              rules={{
                required: t('common_field_required', {
                  field: t('equipment_floor'),
                }),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('equipment_floor')}</FormLabel>
                  <AutoComplete
                    options={floorOptions || []}
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                      field.onChange(value);
                      onChangeFloor(value);
                    }}
                    placeholder={t('common_ph_select', {
                      field: t('equipment_floor').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('equipment_room')}</FormLabel>
                  <AutoComplete
                    options={roomOptions}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('equipment_room').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('equipment_status')}</FormLabel>
                  <AutoComplete
                    options={EQUIPMENT_STATUS_OPTIONS}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('equipment_status').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="sharedType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('equipment_shared_type')}</FormLabel>
                  <AutoComplete
                    options={EQUIPMENT_SHARED_TYPE_OPTIONS}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('equipment_shared_type').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('equipment_description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('equipment_description').toLowerCase(),
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
