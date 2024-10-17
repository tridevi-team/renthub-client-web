import { useEmailStore } from '@app/stores';
import { authRepositories } from '@modules/auth/apis/auth.api';
import { authPath } from '@modules/auth/routes';
import { Button } from '@shared/components/ui/button';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import { toast } from 'sonner';

export const ResendCodeButton = () => {
  const [t] = useI18n();
  const [timeLeft, setTimeLeft] = useState<number>(100);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
    setIsDisabled(false);
  }, [timeLeft]);

  const handleResendCode = async () => {
    setIsDisabled(true);
    setTimeLeft(180);
    const email = useEmailStore.getState().data?.email;
    if (!email) {
      return redirect(authPath.login);
    }

    try {
      setLoading(true);
      await authRepositories.resendVerifyCode({
        json: {
          email,
        },
      });
      setLoading(false);
      toast.info(t('ms_resendCodeSuccess'));
    } catch (error) {
      setLoading(false);
      return toast.error(t('ms_codeResendFailed'));
    }
  };

  return (
    <div className="mt-4 text-center">
      <Button
        type="button"
        onClick={handleResendCode}
        disabled={isDisabled}
        variant="link"
        loading={loading}
      >
        {isDisabled
          ? `${t('auth_resendCode')} (${Math.floor(timeLeft / 60)}:${(
              timeLeft % 60
            )
              .toString()
              .padStart(2, '0')})`
          : t('auth_resendCode')}
      </Button>
    </div>
  );
};
