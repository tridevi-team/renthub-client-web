import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

import { Calendar } from '@shared/components/ui/calendar';
import { Input } from '@shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@shared/components/ui/popover';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

export default function DatePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date?: Date) => void;
}) {
  const [t] = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Input
          readOnly
          className="cursor-pointer text-left"
          prefixElement={<CalendarIcon className="mr-2 h-4 w-4" />}
          value={
            value
              ? format(value, 'P', {
                  locale: vi,
                })
              : ''
          }
          placeholder={t('ph_select_date')}
          ref={inputRef}
        />
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: inputWidth }}
      >
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={onChange}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
