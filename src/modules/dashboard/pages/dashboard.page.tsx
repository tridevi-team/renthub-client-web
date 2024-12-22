import { authPath } from '@auth/routes';
import { billPath } from '@modules/bills/routes';
import { contractPath } from '@modules/contracts/routes';
import { NotiAnimatedList } from '@modules/dashboard/components/animated-noti';
import ContractMarquee from '@modules/dashboard/components/contract-marquee';
import { PaymentOrbit } from '@modules/dashboard/components/payment-orbit-circle';
import { notificationPath } from '@modules/notifications/routes';
import { paymentPath } from '@modules/payments/routes';
import { statsRepositories } from '@modules/stats/apis/stats.api';
import { CountStatsCard } from '@modules/stats/components/count-stats-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/data-table/select';
import { BentoCard, BentoGrid } from '@shared/components/extensions/bento-grid';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Calendar } from '@shared/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { checkAuthUser } from '@shared/utils/checker.util';
import { formatCurrency } from '@shared/utils/helper.util';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import {
  BadgeDollarSign,
  BellIcon,
  Cable,
  CalendarIcon,
  FileTextIcon,
  HouseIcon,
  MessageCircleWarning,
} from 'lucide-react';
import * as React from 'react';
import { redirect, useLocation, type LoaderFunction } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { toast } from 'sonner';
import useSWR from 'swr';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }
  return null;
};

export function Element() {
  const pathname = useLocation().pathname;
  const [timeRange, setTimeRange] = React.useState('6');
  const [chartData, setChartData] = React.useState<
    { date: string; revenue: number; occupancy: number }[]
  >([]);

  const { data: countResp } = useSWR('count-stats', () =>
    statsRepositories.count({
      from: dayjs().subtract(2, 'month').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    }),
  );
  console.log('countResp:', countResp);
  const generateChartData = (months: number, seed: number) => {
    const data = [];
    const today = new Date();
    const random = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    for (let i = months; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);

      const revenue = Math.floor(random(seed + i) * 10000000) + 5000000; // 5M-15M VND
      const occupancy = Math.floor(random(seed + i + months) * 10) + 30; // 30-40 rooms

      data.push({
        date: date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
        revenue,
        occupancy,
      });
    }

    return data;
  };

  const features = [
    {
      Icon: FileTextIcon,
      name: 'Hợp đồng',
      description: 'Gia hạn/Chấm dứt và hơn thế nữa',
      href: `${contractPath.root}`,
      cta: 'Xem ngay',
      className: 'col-span-3 lg:col-span-1',
      background: <ContractMarquee />,
    },
    {
      Icon: BadgeDollarSign,
      name: 'Xác minh thanh toán tự động',
      description: 'Thêm mọi tài khoản ngân hàng của bạn!',
      href: `${paymentPath.root}`,
      cta: 'Thêm ngay',
      className: 'col-span-3 lg:col-span-2',
      background: <PaymentOrbit />,
    },
    {
      Icon: BellIcon,
      name: 'Thông báo',
      description: 'Danh sách đăng ký nhận thông tin phòng',
      href: `${notificationPath.root}`,
      cta: 'Xem ngay',
      className: 'col-span-3 lg:col-span-2',
      background: (
        <NotiAnimatedList className="absolute top-4 right-2 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_5%,#000_100%)] group-hover:scale-105" />
      ),
    },
    {
      Icon: CalendarIcon,
      name: 'Hóa đơn',
      description: 'Tạo hóa đơn hàng tháng ngay!',
      className: 'col-span-3 lg:col-span-1',
      href: `${billPath.root}`,
      cta: 'Tạo ngay',
      background: (
        <Calendar
          mode="single"
          selected={new Date(2024, 1, 11, 0, 0, 0)}
          className="-top-20 absolute right-0 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
        />
      ),
    },
  ];
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    return setChartData(generateChartData(Number.parseInt(timeRange), 42)); // Use a fixed seed value
  }, [timeRange]);

  return (
    <ContentLayout title="Dashboard" pathname={pathname}>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12}>
          <Row gutter={[16, 8]}>
            {[
              {
                title: 'Phòng đang thuê',
                value:
                  countResp?.data?.rooms?.find(
                    (room: { status: string }) => room.status === 'RENTED',
                  )?.count || 0,
                icon: HouseIcon,
              },
              {
                title: 'Phản ánh chưa giải quyết',
                value:
                  countResp?.data?.issues?.find(
                    (i: { status: string }) => i.status === 'OPEN',
                  )?.count || 0,
                icon: MessageCircleWarning,
              },
              {
                title: 'Số hóa đơn còn nợ',
                value:
                  countResp?.data?.bills?.find(
                    (bill: { status: string }) => bill.status === 'UNPAID',
                  )?.count || 0,
                icon: FileTextIcon,
              },
              {
                title: 'Số thiết bị đang sửa',
                value:
                  countResp?.data?.equipment?.find(
                    (device: { status: string }) =>
                      device.status === 'REPAIRING',
                  )?.count || 0,
                icon: Cable,
              },
            ].map((item) => (
              <Col key={item.title} xs={24} sm={12}>
                <CountStatsCard
                  amount={item.value}
                  titleCard={item.title}
                  isCurrency={item.title === 'Hóa đơn'}
                  icon={item.icon}
                />
              </Col>
            ))}
            <Col xs={24} className="mt-4 grid gap-4 md:grid-cols-1">
              <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Thống kê kinh doanh</CardTitle>
                    <CardDescription>
                      Doanh thu và số phòng cho thuê trong {timeRange} tháng qua
                    </CardDescription>
                  </div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
                      <SelectValue placeholder="6 tháng gần đây" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12).keys()].map((i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>
                          {i + 1} tháng gần đây
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  <Row className="aspect-auto h-[17.5rem] w-full">
                    <Col className="w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          width={500}
                          height={400}
                          data={chartData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="fillRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="hsl(var(--chart-1))"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="hsl(var(--chart-1))"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                            <linearGradient
                              id="fillOccupancy"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="hsl(var(--chart-2))"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="hsl(var(--chart-2))"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return date.toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              });
                            }}
                          />
                          <Tooltip
                            formatter={(value: number) => {
                              if (value > 10000) {
                                return formatCurrency(value as number);
                              }
                              return value;
                            }}
                            labelFormatter={(label: string) => {
                              const date = new Date(label);
                              return date.toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              });
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="hsl(var(--chart-1))"
                            fill="url(#fillRevenue)"
                            name="Doanh thu"
                          />
                          <Area
                            type="monotone"
                            dataKey="occupancy"
                            stroke="hsl(var(--chart-2))"
                            fill="url(#fillOccupancy)"
                            name="Số phòng cho thuê"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={24} sm={12}>
          <BentoGrid>
            {features.map((feature, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </Col>
      </Row>
    </ContentLayout>
  );
}
