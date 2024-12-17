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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@shared/components/ui/charts';
import 'dayjs/locale/vi';
import randomColor from 'randomcolor';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type Props = {
  data: {
    name: string;
    totalPrice: number;
  }[];
};

export function BillPieChart({ data }: Props) {
  data = data.filter((item) => item.name !== 'Tiền phòng');
  const chartConfig: { [key: string]: { label: string; color: string } } = {
    totalPrice: {
      label: 'Doanh thu',
      color: '',
    },
    ...(data || []).reduce(
      (
        acc: { [key: string]: { label: string; color: string } },
        item,
        index,
      ) => {
        acc[item.name] = {
          label: item.name,
          color: randomColor({
            luminosity: 'light',
            alpha: 2.5,
            // seed: item.name,
          }),
        };
        return acc;
      },
      {},
    ),
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tỉ trọng doanh thu dịch vụ</CardTitle>
        <CardDescription>{}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie data={data} dataKey="totalPrice">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                    fill={chartConfig[entry.name].color}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Di chuột vào biểu đồ để xem chi tiết
        </div>
        <div className="text-muted-foreground leading-none">
          Biểu đồ biểu thị tỉ trọng doanh thu từ các dịch vụ khác nhau, ngoại
          trừ tiền phòng.
        </div>
      </CardFooter>
    </Card>
  );
}
