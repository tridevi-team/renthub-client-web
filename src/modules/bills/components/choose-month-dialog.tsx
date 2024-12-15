import { billPath } from '@modules/bills/routes';
import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogContent,
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

  const currentYear = dayjs().year();
  const years = Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);

  const selectAfter = (
    <Select
      onChange={(value) => setSelectedYear(value as string)}
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('bill_choose_month')}</DialogTitle>
        </DialogHeader>
        <Row>
          <Col xs={24}>
            <Input
              type="number"
              min={1}
              max={12}
              defaultValue={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full"
              addonAfter={selectAfter}
              addonBefore={'Hóa đơn tháng'}
            />
          </Col>
        </Row>
        <DialogFooter>
          <Button onClick={onSubmit}>{t('bt_next')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
