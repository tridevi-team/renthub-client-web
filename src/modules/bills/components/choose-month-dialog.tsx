import { billPath } from '@modules/bills/routes';
import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Col, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ChooseMonthDialog({ isOpen, onClose }: Props) {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year().toString());

  const currentYear = dayjs().add(1, 'year').year();
  const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);

  const thisYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;

  // Add new validation function
  function isValidDate(year: string, month: number) {
    const selectedDate = dayjs(`${year}-${month}-01`);
    const maxAllowedDate = dayjs().add(1, 'month').endOf('month');
    return (
      selectedDate.isBefore(maxAllowedDate) ||
      selectedDate.isSame(maxAllowedDate, 'month')
    );
  }

  function getMonthRange(year: string) {
    const y = Number(year);
    if (y === thisYear) {
      return { min: 1, max: Math.min(currentMonth + 1, 12) };
    }
    return { min: 1, max: 12 };
  }

  const isFormValid =
    selectedMonth >= getMonthRange(selectedYear).min &&
    selectedMonth <= getMonthRange(selectedYear).max &&
    isValidDate(selectedYear, selectedMonth);

  const selectAfter = (
    <Select
      onChange={(value) => {
        setSelectedYear(value as string);
        setSelectedMonth(1);
      }}
      value={selectedYear}
      options={years.map((year) => ({ label: year, value: year }))}
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
    />
  );

  const onSubmit = () => {
    navigate(`${billPath.root}/${billPath.create}`, {
      state: { month: selectedMonth, year: selectedYear },
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('bill_choose_month')}</DialogTitle>
          <DialogDescription className="italic">
            Chỉ có thể tạo hóa đơn cho các tháng trước tháng hiện tại và 1 tháng
            sau
          </DialogDescription>
        </DialogHeader>
        <Row>
          <Col xs={24}>
            <Input
              type="number"
              min={getMonthRange(selectedYear).min}
              max={getMonthRange(selectedYear).max}
              value={selectedMonth}
              defaultValue={selectedMonth}
              onChange={(e) => {
                const val = Number(e.target.value);
                const { min, max } = getMonthRange(selectedYear);
                setSelectedMonth(Math.max(min, Math.min(max, val)));
              }}
              className="w-full"
              addonAfter={selectAfter}
              addonBefore={'Hóa đơn tháng'}
            />
          </Col>
        </Row>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            {t('bt_back')}
          </Button>
          <Button onClick={onSubmit} disabled={!isFormValid}>
            {t('bt_next')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
