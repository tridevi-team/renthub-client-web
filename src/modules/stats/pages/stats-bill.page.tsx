import { authPath } from '@modules/auth/routes';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { DatePicker } from 'antd';
import to from 'await-to-js';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { type LoaderFunction, redirect, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import {
  type StatsCountResponseSchema,
  statsRepositories,
} from '@modules/stats/apis/stats.api';
import { BillBarChartMultipe } from '@modules/stats/components/bill-bar-chart-multiple';
import { CountStatsCard } from '@modules/stats/components/count-stats-card';
import { useUpdateEffect } from '@shared/hooks/use-update-effect.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { formatCurrency } from '@shared/utils/helper.util';
import { FileChartColumnIncreasing } from 'lucide-react';

const { RangePicker } = DatePicker;

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const hasPermission = checkPermissionPage({
    module: 'bill',
    action: 'read',
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

export function Element() {
  const [t] = useI18n();
  const [rangeDate, setRangeDate] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('month').subtract(1, 'month'),
    dayjs().endOf('month').subtract(1, 'day'),
  ]);
  const [countStatBills, setCountStatBills] =
    useState<
      {
        status: string;
        count: number;
        totalPrice: number;
      }[]
    >();
  const [chartStatBills, setChartStatBills] = useState<any>();
  const location = useLocation();
  const pathname = location.pathname;

  const onChangeRangeDate = (dates: any) => {
    if (dates && dates.length === 2) {
      if (dates[0] && dates[1]) {
        setRangeDate([dates[0], dates[1]]);
      }
    }
  };

  const fetchCountData = async (rangeDate: [Dayjs, Dayjs]) => {
    const [fromDate, toDate] = rangeDate.map((date) =>
      date.format('YYYY-MM-DD'),
    );
    const [err, resp]: AwaitToResult<StatsCountResponseSchema> = await to(
      statsRepositories.count({
        from: fromDate,
        to: toDate,
        modules: ['bills'],
      }),
    );
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return;
    }
    if (resp?.data) {
      const { bills } = resp.data;
      if (bills?.length) setCountStatBills(bills);
    }
  };

  const fetchChartData = async (rangeDate: [Dayjs, Dayjs]) => {
    const [fromDate, toDate] = rangeDate.map((date) =>
      date.format('YYYY-MM-DD'),
    );
    const [err, resp]: AwaitToResult<StatsCountResponseSchema> = await to(
      statsRepositories.chart({
        from: fromDate,
        to: toDate,
      }),
    );
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return;
    }
    if (resp?.data) {
      setChartStatBills(resp.data);
    }
  };

  useEffect(() => {
    fetchCountData(rangeDate);
    fetchChartData(rangeDate);
  }, []);

  useUpdateEffect(() => {
    fetchCountData(rangeDate);
    fetchChartData(rangeDate);
  }, [rangeDate]);

  return (
    <ContentLayout title={t('stats_bill_title')} pathname={pathname}>
      <Row className="mb-4 justify-end">
        <Col xs={12} className="flex justify-end">
          <RangePicker
            defaultValue={rangeDate}
            onChange={onChangeRangeDate}
            format="DD/MM/YYYY"
          />
        </Col>
      </Row>
      <Row className="gap-y-3">
        {countStatBills
          ?.sort((a, b) =>
            a.status === 'ALL' ? -1 : b.status === 'ALL' ? 1 : 0,
          )
          .filter((stat) => !['CANCELLED', 'OVERDUE'].includes(stat.status))
          .map((stat) => {
            return (
              <Col xs={12} sm={6} md={3} key={stat.status}>
                <CountStatsCard
                  icon={FileChartColumnIncreasing}
                  amount={stat.count}
                  titleCard={t(
                    `stats_bill_${stat.status?.toLowerCase() as 'all' | 'unpaid' | 'paid' | 'in_debt' | 'cancelled' | 'overdue'}`,
                  )}
                  description={`Tổng tiền: ${formatCurrency(stat.totalPrice)}`}
                />
              </Col>
            );
          })}
      </Row>
      <Row className="mt-4">
        <Col xs={12} md={6}>
          {chartStatBills && (
            <BillBarChartMultipe
              data={chartStatBills?.barChartConsumption?.data}
              config={chartStatBills?.barChartConsumption?.config}
              dateRange={rangeDate}
            />
          )}
        </Col>
      </Row>
    </ContentLayout>
  );
}
