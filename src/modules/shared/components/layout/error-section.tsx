import ErrorImgae from '@assets/images/ErrorImg.png';
import { Button } from '@shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
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
        className={`w-full max-w-md transform border-none shadow-none transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-36 w-36 items-center justify-center rounded-full bg-red-100">
            <img
              src={ErrorImgae}
              loading="lazy"
              className="h-full object-cover"
              alt="error"
            />
          </div>
          <CardTitle className="font-bold text-2xl text-red-600">
            {t('OOPS')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 text-lg">
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
