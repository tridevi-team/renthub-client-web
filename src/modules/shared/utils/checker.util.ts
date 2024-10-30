import type { UserStoreLocalStorage } from '@auth/hooks/use-auth-user-store.hook';
import {
  userStoreLocalStorageSchema,
  userStoreName,
} from '@auth/hooks/use-auth-user-store.hook';
import type { PermissionKeyType } from '@modules/auth/schemas/auth.schema';

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

export function checkPermissionPage({
  permission,
  houseId,
}: {
  permission: PermissionKeyType;
  houseId: string;
}) {
  const appUser = localStorage.getItem(userStoreName) ?? '{}';
  const parsedAppUser = JSON.parse(appUser) as UserStoreLocalStorage;
  const parsed = userStoreLocalStorageSchema.safeParse(parsedAppUser);

  if (!parsed.success) return false;
  if (!parsed.data.state.user) return false;
  if (!parsed.data.state.user.houses?.length) return false;

  const houses = parsed.data.state.user.houses;
  const house = houses.find((h) => h.id === houseId);
  if (!house) return false;

  const { permissions } = house;
  if (!permissions) return false;

  return permissions[permission];
}
