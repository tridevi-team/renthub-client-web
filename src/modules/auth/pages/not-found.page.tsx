import { useAuthUserStore } from '@auth/hooks/use-auth-user-store.hook';
import { authPath } from '@auth/routes';
import { dashboardPath } from '@modules/dashboard/routes';
import { Link } from '@shared/components/ui/link';
import { useColorMode } from '@shared/hooks/use-color-mode.hook';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';

export function Element() {
  const userStore = useAuthUserStore();
  const [t] = useI18n();
  useColorMode({});

  return (
    <div className="font-mono flex min-h-screen flex-col items-center justify-center opacity-80 bg-[radial-gradient(hsl(var(--primary))_0.5px_,transparent_0.5px),radial-gradient(hsl(var(--primary))_0.5px_,hsl(var(--background))_0.5px)] bg-[0_0_,10px_10px] bg-[length:20px_20px]">
      <h1 className="text-8xl font-bold tracking-wider text-primary">404</h1>
      <h2 className="my-3 text-2xl font-semibold">
        {t('common_pageNotFound')}
      </h2>

      <Link
        href={userStore.user ? dashboardPath.root : authPath.login}
        className="mt-10 duration-300 transition hover:skew-x-12"
      >
        {t('common_backTo', {
          target: userStore.user ? t('dashboard_title') : t('auth_login'),
        })}
      </Link>
    </div>
  );
}
