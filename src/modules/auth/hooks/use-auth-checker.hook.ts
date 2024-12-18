import { useAuthUserStore } from '@auth/hooks/use-auth-user-store.hook';
import { authPath } from '@auth/routes';
import { dashboardPath } from '@modules/dashboard/routes';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useMount } from '@shared/hooks/use-mount.hook';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { P, match } from 'ts-pattern';
/**
 * Hooks to check the authentication of your user, wheter they're logged in or not
 *
 * @example
 *
 * ```tsx
 * useAuthChecker()
 * ```
 */
export function useAuthChecker() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthUserStore();

  useMount(() => {
    match([!!user, location.pathname.includes('login')])
      .with([false, true], () => {})
      .with([false, P.any], () => {
        navigate(authPath.login, { replace: true });
        toast.error(t('LOGIN_REQUIRED'));
      })
      .with([true, true], () => {
        navigate(dashboardPath.root);
        // toast.info(t('ms_loginSuccess'));
      })
      .otherwise(() => {});
  });
}
