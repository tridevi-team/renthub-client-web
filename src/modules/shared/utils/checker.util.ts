import type { UserStoreLocalStorage } from '@auth/hooks/use-auth-user-store.hook';
import {
  userStoreLocalStorageSchema,
  userStoreName,
} from '@auth/hooks/use-auth-user-store.hook';

/**
 * check if user is authenticated or not by checking localStorage and parse the schema
 */
export function checkAuthUser() {
  const appUser = localStorage.getItem(userStoreName) ?? '{}';
  const parsedAppUser = JSON.parse(appUser) as UserStoreLocalStorage;
  const parsed = userStoreLocalStorageSchema.safeParse(parsedAppUser);

  if (!parsed.success) return false;
  if (!parsed.data.state.user) return false;

  return true;
}

export function checkUserHasHouse() {
  const appUser = localStorage.getItem(userStoreName) ?? '{}';
  const parsedAppUser = JSON.parse(appUser) as UserStoreLocalStorage;
  const parsed = userStoreLocalStorageSchema.safeParse(parsedAppUser);

  if (!parsed.success) return false;
  if (!parsed.data.state.user) return false;
  if (!parsed.data.state.user.houses?.length) return false;

  return true;
}

export function checkPermissionPage() {
  const appUser = localStorage.getItem(userStoreName) ?? '{}';
  const parsedAppUser = JSON.parse(appUser) as UserStoreLocalStorage;
  const parsed = userStoreLocalStorageSchema.safeParse(parsedAppUser);
  console.log('parsed:', parsed);
  return null;
}
