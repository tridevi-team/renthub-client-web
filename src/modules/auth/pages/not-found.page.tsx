import notFound from '@assets/images/NotFound.png';
import { useAuthUserStore } from '@auth/hooks/use-auth-user-store.hook';
import { Button } from '@shared/components/ui/button';
import { useColorMode } from '@shared/hooks/use-color-mode.hook';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Link } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';

export function Element() {
  const userStore = useAuthUserStore();
  const [t] = useI18n();
  const navigate = useNavigate();
  useColorMode({});

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[0_0_,10px_10px] bg-[length:20px_20px] bg-[radial-gradient(hsl(var(--primary))_0.5px_,transparent_0.5px),radial-gradient(hsl(var(--primary))_0.5px_,hsl(var(--background))_0.5px)] opacity-80">
      <img
        src={notFound}
        alt="404 not found"
        loading="lazy"
        className="w-96"
        aria-label="404 not found"
      />
      <Button variant="outline" className="mt-5 h-10 justify-center">
        <Link onPress={() => navigate(-1)}>
          {t('common_backTo', {
            target: userStore.user ? t('common_previousPage') : t('auth_login'),
          })}
        </Link>
      </Button>
    </div>
  );
}
