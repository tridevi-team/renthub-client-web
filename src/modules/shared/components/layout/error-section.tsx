import { Button } from '@shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LargeTableErrorSectionProps {
  onRetry: () => void;
}

export default function ErrorCard({ onRetry }: LargeTableErrorSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [t] = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex min-h-[400px] items-center justify-center p-4"
      role="alert"
      aria-live="assertive"
    >
      <Card
        className={`w-full max-w-md transform transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="font-bold text-2xl text-red-600">
            {t('OOPS')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            {t('SOMETHING_WENT_WRONG')}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={onRetry}
            size="lg"
            variant="outline"
            className="font-semibold"
          >
            {t('bt_retry')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
