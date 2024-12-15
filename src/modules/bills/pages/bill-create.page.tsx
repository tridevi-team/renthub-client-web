import { authPath } from '@auth/routes';
import { billRepositories } from '@modules/bills/apis/bill.api';
import { billPath } from '@modules/bills/routes';
import { renterRepositories } from '@modules/renters/apis/renter.api';
import { roomRepositories } from '@modules/rooms/apis/room.api';
import type { RoomSchema } from '@modules/rooms/schema/room.schema';
import { ScrollableDiv } from '@shared/components/extensions/scrollable-div';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@shared/components/ui/table';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { formatCurrency } from '@shared/utils/helper.util';
import { Col, DatePicker, Row, Skeleton } from 'antd';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import {
  redirect,
  useLocation,
  useNavigate,
  type LoaderFunction,
} from 'react-router-dom';
import { toast } from 'sonner';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const hasPermission = checkPermissionPage({
    module: 'bill',
    action: 'create',
  });
  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }
  if (!hasPermission) {
    return redirect(authPath.notPermission);
  }

  return null;
};

export type BillCreateRequest = {
  data: {
    roomId: string;
    title: string;
    startDate: string;
    endDate: string;
    services: {
      id: string;
      oldValue: number;
      newValue: number;
    }[];
  }[];
};

const { RangePicker } = DatePicker;

export function Element() {
  const [t] = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomSchema>();
  const [rooms, setRooms] = useState<RoomSchema[]>();
  const [renterName, setRenterName] = useState<string>();
  const [roomPrice, setRoomPrice] = useState<number>();
  const [rangeDate, setRangeDate] = useState<any>([
    dayjs(`${dayjs().month() + 1}/15/${dayjs().year()}`, 'MM/DD/YYYY'),
    dayjs(`${dayjs().month() + 1}/15/${dayjs().year()}`, 'MM/DD/YYYY').add(
      1,
      'month',
    ),
  ]);
  const [serviceData, setServiceData] =
    useState<
      {
        id: string;
        name: string;
        type: string;
        oldValue: number;
        newValue: number;
        quantity: number;
        unitPrice: number;
        total: number;
      }[]
    >();
  const { month, year } = location.state || {
    month: dayjs().month() + 1,
    year: dayjs().year(),
  };

  const fetchData = useCallback(async () => {
    const [roomErr, roomResp]: AwaitToResult<any> = await to(
      roomRepositories.all({
        searchParams: {
          filters: [
            {
              field: 'rooms.status',
              operator: 'in',
              value: 'RENTED|PENDING',
            },
          ],
          sorting: [
            {
              field: 'rooms.name',
              direction: 'desc',
            },
          ],
          page: -1,
          pageSize: -1,
        },
        isSelect: false,
      }),
    );
    const [billErr, billResp]: AwaitToResult<any> = await to(
      billRepositories.index({
        searchParams: {
          filters: [
            {
              field: 'bills.title',
              operator: 'eq',
              value: `Hóa đơn tháng ${month} - ${year}`,
            },
          ],
          page: -1,
          pageSize: -1,
        },
      }),
    );
    if (roomErr || billErr || !roomResp || !billResp) {
      if (roomErr && 'code' in roomErr) {
        setRooms([]);
        return toast.error(t(roomErr?.code));
      }
    }
    const roomHasBills = billResp?.data?.results?.map(
      (bill: any) => bill.roomId,
    );
    const roomNotHasBills = roomResp?.data?.results?.filter(
      (room: any) => !roomHasBills?.includes(room.id),
    );
    unstable_batchedUpdates(() => {
      setRooms(roomNotHasBills);
      setSelectedRoom(roomNotHasBills?.[0]);
    });
  }, []);

  const fetchLatestServiceIndex = async () => {
    if (!selectedRoom) {
      return;
    }
    const [err, resp] = await to(
      roomRepositories.latestServices({ id: selectedRoom?.id }),
    );
    const [err2, resp2] = await to(
      renterRepositories.getRenterByRoom({ roomId: selectedRoom?.id }),
    );
    if (err || !resp || err2 || !resp2) {
      return;
    }
    const renters = resp2?.data?.results;
    const renter = renters?.[0];
    const services = resp?.data?.map((service: any) => {
      let quantity = service.quantity || 1;
      if (service.type === 'PEOPLE') {
        quantity = renters?.length || 1;
      } else if (service.type === 'ROOM') {
        quantity = 1;
      }
      return {
        id: service.id,
        name: service.name,
        type: service.type,
        oldValue: service.oldValue || 0,
        newValue: service.oldValue || 0,
        quantity,
        unitPrice: service.unitPrice || 0,
        total: quantity * (service.unitPrice || 0),
      };
    });
    unstable_batchedUpdates(() => {
      setRenterName(renter?.name);
      setServiceData(services);
    });
  };

  const handleServiceChange = (id: string, field: string, value: any) => {
    const newServiceData = serviceData?.map((service) => {
      if (service.id === id) {
        const updatedService = {
          ...service,
          [field]: value,
        };
        if (
          service.type === 'ELECTRICITY_CONSUMPTION' ||
          service.type === 'WATER_CONSUMPTION'
        ) {
          updatedService.quantity =
            updatedService.newValue - updatedService.oldValue;
          updatedService.total =
            updatedService.quantity * updatedService.unitPrice;
        } else if (service.type !== 'PEOPLE' && service.type !== 'ROOM') {
          updatedService.total =
            updatedService.quantity * updatedService.unitPrice;
        }
        return updatedService;
      }
      return service;
    });
    setServiceData(newServiceData);
  };

  const onSubmit = async () => {
    if (!selectedRoom) {
      return;
    }
    const billData = {
      title: `Hóa đơn tháng ${month} - ${year}`,
      startDate: rangeDate[0].toISOString(),
      endDate: rangeDate[1].toISOString(),
      services:
        serviceData?.map((service) => {
          const result: any = {
            ...service,
            id: service.id,
            oldValue: service.oldValue,
            newValue: service.newValue,
          };
          if (service.type === 'PEOPLE' || service.type === 'ROOM') {
            result.quantity = service.quantity;
          }
          for (const key in result) {
            if (!result[key] && result[key] !== 0) {
              delete result[key];
            }
          }
          return result;
        }) || [],
    };
    setIsSubmitting(true);
    const [err]: AwaitToResult<any> = await to(
      billRepositories.create({
        data: [
          {
            roomId: selectedRoom.id,
            ...billData,
          },
        ],
      }),
    );
    setIsSubmitting(false);
    if (err) {
      return toast.error(t(err?.code));
    }
    toast.success(t('ms_create_bill_success'));
    fetchData();
  };

  const totalAmount = serviceData?.reduce((sum, service) => {
    return sum + service.total;
  }, 0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchLatestServiceIndex();
  }, [selectedRoom]);

  if (!rooms) {
    return (
      <ContentLayout title={t('bill_create_title')} pathname={pathname}>
        <Skeleton active />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={t('bill_create_title')} pathname={pathname}>
      <Row gutter={[16, 16]}>
        <Col xs={18}>
          <Card>
            <CardContent>
              <ScrollableDiv className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
                <Row gutter={[16, 16]}>
                  <Col xs={24} className="my-3">
                    <h2 className="font-semibold text-2xl">{`Hóa đơn tháng ${month} - ${year}`}</h2>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Label>Tên người thuê</Label>
                    <Input className="mt-1" disabled value={renterName} />
                  </Col>
                  <Col xs={24} sm={12} className="gap-2">
                    <Label>Ngày bắt đầu - Ngày kết thúc</Label>
                    <RangePicker
                      defaultValue={rangeDate}
                      className="mt-1 h-9 w-full"
                      onChange={(dates) => setRangeDate(dates)}
                      value={rangeDate}
                      format="DD/MM/YYYY"
                    />
                  </Col>
                  <Col xs={24}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dịch vụ</TableHead>
                          <TableHead>Chỉ số cũ</TableHead>
                          <TableHead>Chỉ số mới</TableHead>
                          <TableHead>Số lượng</TableHead>
                          <TableHead>Đơn giá</TableHead>
                          <TableHead>Thành tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceData?.map((service) => (
                          <TableRow key={service.id} className="h-8">
                            <TableCell>{service.name}</TableCell>
                            {service.type === 'ELECTRICITY_CONSUMPTION' ||
                            service.type === 'WATER_CONSUMPTION' ? (
                              <>
                                <TableCell className="w-1/6">
                                  <Input
                                    value={service.oldValue}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        service.id,
                                        'oldValue',
                                        Number(e.target.value),
                                      )
                                    }
                                    className="h-8 text-sm"
                                  />
                                </TableCell>
                                <TableCell className="w-1/6">
                                  <Input
                                    value={service.newValue}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        service.id,
                                        'newValue',
                                        Number(e.target.value),
                                      )
                                    }
                                    className="h-8 text-sm"
                                  />
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                              </>
                            )}
                            <TableCell className="w-1/6">
                              {service.type === 'ELECTRICITY_CONSUMPTION' ||
                              service.type === 'WATER_CONSUMPTION' ? (
                                <Input
                                  value={service.quantity}
                                  disabled
                                  className="h-8 text-sm"
                                />
                              ) : service.type === 'PEOPLE' ||
                                service.type === 'ROOM' ? (
                                <Input
                                  value={service.quantity}
                                  disabled
                                  className="h-8 text-sm"
                                />
                              ) : (
                                <Input
                                  value={service.quantity}
                                  onChange={(e) =>
                                    handleServiceChange(
                                      service.id,
                                      'quantity',
                                      Number(e.target.value),
                                    )
                                  }
                                  className="h-8 text-sm"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(service.unitPrice)}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(service.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Col>
                  <Col xs={24} className="flex justify-end">
                    <h3 className="font-semibold text-lg">
                      Giá phòng: {formatCurrency(roomPrice || 0)}
                    </h3>
                  </Col>
                  <Col xs={24} className="flex justify-end">
                    <h3 className="font-semibold text-xl">
                      Tổng cộng:{' '}
                      {formatCurrency((totalAmount ?? 0) + (roomPrice ?? 0))}
                    </h3>
                  </Col>
                  <Col xs={24} className="flex">
                    <Button
                      type="button"
                      onClick={() => navigate(billPath.root)}
                      className="mr-2"
                      variant={'outline'}
                    >
                      Quay lại
                    </Button>
                    <Button onClick={onSubmit} loading={isSubmitting}>
                      Tạo hóa đơn
                    </Button>
                  </Col>
                </Row>
              </ScrollableDiv>
            </CardContent>
          </Card>
        </Col>
        <Col xs={6}>
          <Card>
            <CardContent className="py-3">
              <ScrollableDiv className="max-h-[70vh] overflow-auto">
                {(rooms || []).map((room) => (
                  <Button
                    key={room.id}
                    className="mt-1.5 w-full justify-start"
                    onClick={() => setSelectedRoom(room)}
                    variant={
                      selectedRoom?.id === room.id ? 'default' : 'outline'
                    }
                  >
                    {room.name}
                  </Button>
                ))}
              </ScrollableDiv>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </ContentLayout>
  );
}
