import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/charts';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

type BillBarChartMultipeProps = {
  data: {
    month: string;
    [key: string]: string | number;
  }[];
  config: ChartConfig;
  dateRange: [Dayjs, Dayjs];
};

export function BillBarChartMultipe({
  data,
  config,
  dateRange,
}: BillBarChartMultipeProps) {
  data = data.map((item) => {
    const { 'tien-phong': _, month, ...rest } = item;
    const formatMonth = dayjs(month, 'MM/YYYY').format('MMM YYYY');
    return {
      month: formatMonth,
      ...rest,
    };
  });
  const dateRangeString = `${dateRange[0].format('MM/YYYY')} - ${dateRange[1].format('MM/YYYY')}`;
  const monthCount = data?.length || 0;

  return (
    // <div className="max-h-[300px]">
    <Card>
      <CardHeader>
        <CardTitle>Thống kê tiền dịch vụ theo tháng</CardTitle>
        <CardDescription>{dateRangeString}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              {Object.keys(data[0])
                .filter((key) => key !== 'month')
                .map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`var(--color-${key})`}
                    radius={4}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Di chuột vào biểu đồ để xem chi tiết
        </div>
        <div className="text-muted-foreground leading-none">
          Hiển thị tổng số tiền dịch vụ của hóa đơn trong {monthCount} tháng qua
        </div>
      </CardFooter>
    </Card>
  );
}
