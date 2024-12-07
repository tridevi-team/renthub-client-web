import type { z } from '@app/lib/vi-zod';
import { useHouseStore } from '@app/stores';
import type { Option } from '@app/types';
import { floorRepositories } from '@modules/floors/apis/floor.api';
import { roomPath } from '@modules/rooms/routes';
import type { roomFormRequestSchema } from '@modules/rooms/schema/room.schema';
import { serviceRepositories } from '@modules/services/apis/service.api';
import type { ServiceSchema } from '@modules/services/schema/service.schema';
import { fileRepositories } from '@shared/apis/upload.api';
import { ScrollableDiv } from '@shared/components/extensions/scrollable-div';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { MultiSelect } from '@shared/components/selectbox/multi-select';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table';
import { Textarea } from '@shared/components/ui/textarea';
import {
  ROOM_STATUS_OPTIONS,
  SERVICE_TYPES,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useUpdateEffect } from '@shared/hooks/use-update-effect.hook';
import to from 'await-to-js';
import { ChevronLeft, Save, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import type { FileRejection } from 'react-dropzone';
import { Col, Row } from 'react-grid-system';
import type { UseFormReturn } from 'react-hook-form';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'shadcn-dropzone';
import { toast } from 'sonner';

type RoomFormProps = {
  form: UseFormReturn<z.infer<typeof roomFormRequestSchema>>;
  onSubmit: (values: any) => void;
  loading?: boolean;
  isEdit?: boolean;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_COUNT = 10;
const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'image/webp': [],
  'image/heic': [],
  'image/jfif': [],
};

export function RoomForm({
  form,
  loading,
  onSubmit,
  isEdit = false,
}: RoomFormProps) {
  const [t] = useI18n();
  const navigate = useNavigate();
  const { data: selectedHouse } = useHouseStore();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [urlImages, setUrlImages] = useState<string[]>(
    form.getValues()?.images || [],
  );
  const [floorOptions, setFloorOptions] = useState<Option[]>([]);
  const [houseServices, setHouseServices] = useState<ServiceSchema[]>([]);
  const [serviceOptions, setServiceOptions] = useState<Option[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceSchema[]>([]);
  const [startIndexMap, setStartIndexMap] = useState<Record<string, number>>(
    {},
  );

  const mesureMap = useMemo(
    () => ({
      people: t('service_type_people'),
      room: t('service_type_room'),
      water_consumption: t('service_type_index'),
      electricity_consumption: t('service_type_index'),
    }),
    [t],
  );

  const fetchFloorData = async () => {
    const [err, floorData] = await to(
      floorRepositories.index({
        searchParams: {
          pageSize: -1,
          page: -1,
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

  const fetchHouseServices = async () => {
    const [err, houseServicesData] = await to(
      serviceRepositories.index({
        searchParams: {
          pageSize: -1,
          page: -1,
          sorting: [
            {
              field: 'services.name',
              direction: 'asc',
            },
          ],
        },
      }),
    );
    if (err) return setHouseServices([]);
    if (houseServicesData) {
      const data = houseServicesData?.data?.results || [];
      unstable_batchedUpdates(() => {
        setHouseServices(data);
        setServiceOptions(
          data.map((service) => ({
            label: service.name,
            value: service.id,
          })),
        );
      });
    }
  };

  const handleOnUploadImage = async (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
  ) => {
    if (fileRejections.length) {
      toast.error(t('FILE_TYPE_NOT_ALLOWED'));
      return;
    }
    if (uploadedImages.length + acceptedFiles.length > MAX_IMAGE_COUNT) {
      return toast.error(t('FILE_LIMIT_EXCEEDED'));
    }
    for (const file of acceptedFiles) {
      if (file.size > MAX_IMAGE_SIZE) {
        return toast.error(t('FILE_TOO_LARGE_MAX_SIZE', { maxSize: '5' }));
      }
    }
    const formData = new FormData();
    for (const file of acceptedFiles) {
      formData.append('files', file);
    }
    const [err, resp] = await to(fileRepositories.upload(formData));
    if (err) {
      toast.error(t('FILE_UPLOAD_FAILED'));
      return;
    }
    if (resp) {
      const urls = resp.data.files.map((file) => file.url);
      unstable_batchedUpdates(() => {
        setUrlImages((prev) => [...prev, ...urls]);
        setUploadedImages((prev) => [...prev, ...acceptedFiles]);
      });
    }
  };

  const onRemoveImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      setUrlImages((prev) => prev.filter((_, i) => i !== index));
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    });
  };

  const handleDataSubmit = (values: any) => {
    const { serviceIds, ...rest } = values;
    const services = serviceIds.map((serviceId: string) => {
      const service: any = {
        serviceId,
        quantity: 1,
        startIndex: startIndexMap[serviceId] || null,
      };
      for (const key in service)
        if (!service[key] && service[key] !== 0) delete service[key];
      return service;
    });
    return onSubmit({ ...rest, services, images: urlImages });
  };

  useEffect(() => {
    fetchFloorData();
    fetchHouseServices();
  }, []);

  useUpdateEffect(() => {
    form.setValue('floor', '');
    fetchFloorData();
  }, [selectedHouse]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleDataSubmit)}
        className="space-y-4 px-2"
      >
        <Row className="gap-y-3 px-36">
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room_name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('common_ph_input', {
                        field: t('room_name').toLowerCase(),
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
              name="floor"
              rules={{
                required: t('common_field_required', {
                  field: t('room_floor'),
                }),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room_floor')}</FormLabel>
                  <AutoComplete
                    options={floorOptions || []}
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('room_floor').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="maxRenters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room_max_renter')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      suffixElement={t('meas_person')}
                      value={field.value ?? 1}
                      placeholder={t('common_ph_input', {
                        field: t('room_max_renter').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="roomArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room_area')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      value={field.value || 1}
                      placeholder={t('common_ph_input', {
                        field: t('room_area').toLowerCase(),
                      })}
                      suffixElement={t('meas_square_meter')}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room_price')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      inputMode="numeric"
                      value={field.value || 0}
                      placeholder={t('common_ph_input', {
                        field: t('room_price').toLowerCase(),
                      })}
                      suffixElement={t('meas_vnd')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12}>
            <FormField
              control={form.control}
              name="serviceIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room_services')}</FormLabel>
                  <MultiSelect
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedServices(
                        houseServices.filter((service) =>
                          value.includes(service.id),
                        ),
                      );
                    }}
                    options={serviceOptions}
                    value={field.value || []}
                    placeholder={t('common_ph_select', {
                      field: t('room_services').toLowerCase(),
                    })}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} className={selectedServices?.length ? '' : 'hidden'}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('service_index')}</TableHead>
                  <TableHead>{t('service_name')}</TableHead>
                  <TableHead>{t('service_description')}</TableHead>
                  <TableHead>{t('service_unit_price')}</TableHead>
                  <TableHead>{t('service_cal_by')}</TableHead>
                  <TableHead>{t('service_start_index')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(selectedServices || []).map((service, index) => (
                  <TableRow key={service.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.unitPrice}</TableCell>
                    <TableCell>
                      {
                        mesureMap[
                          service.type?.toLocaleLowerCase() as keyof typeof mesureMap
                        ]
                      }
                    </TableCell>
                    <TableCell>
                      <Input
                        disabled={
                          ![
                            SERVICE_TYPES.ELECTRICITY_CONSUMPTION,
                            SERVICE_TYPES.WATER_CONSUMPTION,
                          ].includes(service.type)
                        }
                        type="number"
                        inputMode="numeric"
                        onChange={(e) => {
                          setStartIndexMap((prev) => ({
                            ...prev,
                            [service.id]: Number(e.target.value),
                          }));
                        }}
                        placeholder={t('common_ph_input', {
                          field: t('service_start_index').toLowerCase(),
                        })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Col>
          <Col xs={12}>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('room_status')}</FormLabel>
                  <AutoComplete
                    options={ROOM_STATUS_OPTIONS}
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    placeholder={t('common_ph_select', {
                      field: t('room_status').toLowerCase(),
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
          <Col xs={12}>
            <FormLabel>{t('room_images')}</FormLabel>
            <Dropzone
              showFilesList
              multiple
              accept={ACCEPTED_IMAGE_TYPES}
              onDrop={handleOnUploadImage}
              maxFiles={MAX_IMAGE_COUNT}
              maxSize={MAX_IMAGE_SIZE}
              containerClassName="mt-4"
              dropZoneClassName="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer"
            >
              {(_) => (
                <div className="gap-y-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-row items-center gap-0.5 font-medium text-sm">
                      {t('common_upload_image')}
                    </div>
                  </div>
                  <div className="mt-1 font-medium text-gray-400 text-xs">
                    {t('common_count_uploaded_image', {
                      count: `${urlImages?.length}/${MAX_IMAGE_COUNT}`,
                    })}
                  </div>
                </div>
              )}
            </Dropzone>
          </Col>
          <Col xs={12} className={urlImages?.length ? '' : 'hidden'}>
            <PhotoProvider>
              <ScrollableDiv className="flex space-x-2 overflow-x-auto">
                {urlImages.map((url, index) => (
                  <PhotoView
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    src={url}
                  >
                    <div className="relative">
                      <img
                        src={url}
                        alt="room-image"
                        className="h-32 cursor-pointer"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 rounded-full bg-white p-1 text-white"
                        onClick={(e) => onRemoveImage(e, index)}
                      >
                        <Trash color="black" size={12} />
                      </button>
                    </div>
                  </PhotoView>
                ))}
              </ScrollableDiv>
            </PhotoProvider>
          </Col>
          <Col xs={24} className="mt-5">
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                loading={loading}
                variant="outline"
                className="min-w-24"
                onClick={() => {
                  navigate(`${roomPath.root}`);
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
