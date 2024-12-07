import { authPath } from '@auth/routes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/data-table/select';
import { ContentLayout } from '@shared/components/layout/content-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@shared/components/ui/charts';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { checkAuthUser } from '@shared/utils/checker.util';
import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { redirect, useLocation, type LoaderFunction } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { toast } from 'sonner';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
    return redirect(authPath.login);
  }
  return null;
};

const visitorData = [
  { month: 'January', visitors: 186 },
  { month: 'February', visitors: 305 },
  { month: 'March', visitors: 237 },
  { month: 'April', visitors: 73 },
  { month: 'May', visitors: 209 },
  { month: 'June', visitors: 214 },
];

const visitorChartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function Element() {
  const pathname = useLocation().pathname;
  const [timeRange, setTimeRange] = React.useState('90d');
  const [chartData, setChartData] = React.useState<
    { date: string; revenue: number; occupancy: number }[]
  >([]);
  function generateChartData(timeRange: string) {
    const data = [];
    const today = new Date();
    const days = timeRange === '90d' ? 90 : timeRange === '30d' ? 30 : 7;

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const revenue = Math.floor(Math.random() * 10000000) + 5000000; // 5M-15M VND
      const occupancy = Math.floor(Math.random() * 10) + 30; // 30-40 rooms

      data.push({
        date: date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
        revenue,
        occupancy,
      });
    }

    return data;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    return setChartData(generateChartData(timeRange));
  }, [timeRange]);

  return (
    <ContentLayout title="Dashboard" pathname={pathname}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Tổng phòng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Phòng đã thuê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">38</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Phòng trống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Doanh thu tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">15.800.000đ</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Thống kê kinh doanh</CardTitle>
              <CardDescription>
                Doanh thu và số phòng cho thuê trong{' '}
                {timeRange === '90d'
                  ? '3 tháng'
                  : timeRange === '30d'
                    ? '30 ngày'
                    : '7 ngày'}{' '}
                qua
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
                <SelectValue placeholder="3 tháng gần đây" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">3 tháng gần đây</SelectItem>
                <SelectItem value="30d">30 ngày gần đây</SelectItem>
                <SelectItem value="7d">7 ngày gần đây</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <div className="aspect-auto h-[300px] w-full">
              <div className="h-[300px] w-full">
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
                          month: 'numeric',
                          day: 'numeric',
                        });
                      }}
                    />
                    <Tooltip />
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
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê người xem nhà trọ</CardTitle>
            <CardDescription>Tháng 1 - 6, Năm 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={visitorChartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={visitorData}
                    margin={{
                      top: 20,
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Line
                      dataKey="visitors"
                      type="natural"
                      stroke="var(--color-visitors)"
                      strokeWidth={2}
                      dot={{
                        fill: 'var(--color-visitors)',
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Line>
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
              Nhiều người xem hơn 5.2% so với tháng trước{' '}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
              {/* Showing total visitors for the last 6 months */}
              Hiển thị tổng số người xem trong 6 tháng qua
            </div>
          </CardFooter>
        </Card>
      </div>
    </ContentLayout>
  );
}
