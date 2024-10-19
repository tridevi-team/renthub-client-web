import { navigate } from '@app/providers/router/navigation';
import type { QueryOptions } from '@app/types';
import { useAuthUserStore } from '@modules/auth/hooks/use-auth-user-store.hook';
import { env } from '@shared/constants/env.constant';
import ky, { type Options, type SearchParamsOption } from 'ky';

class Http {
  instance: typeof ky;

  constructor(config: Options) {
    this.instance = ky.create(config);
  }

  /**
   * Extends the default configuration of the Http instance
   */
  updateConfig(newConfig: Options): void {
    this.instance = ky.extend(newConfig);
  }

  /**
   * Reset or create new configuration of the Http instance
   */
  resetConfig(newConfig: Options): void {
    this.instance = ky.create(newConfig);
  }

  /**
   * Make Query Search
   */

  _makeQuery(options: QueryOptions): SearchParamsOption {
    const { filters = [], sorting = [], pageSize, page } = options;
    const searchParams: [string, string | number | boolean][] = [];

    // Handle filters
    for (const filter of filters) {
      searchParams.push(['filter[]', JSON.stringify(filter)]);
    }

    for (const sort of sorting) {
      searchParams.push(['sort[]', JSON.stringify(sort)]);
    }

    // Handle pagination
    if (pageSize !== undefined) {
      searchParams.push(['pageSize', pageSize.toString()]);
    }
    if (page !== undefined) {
      searchParams.push(['page', page.toString()]);
    }

    return searchParams;
  }
}

// Set config defaults when creating the instance
export const http = new Http({
  prefixUrl: env.apiBaseUrl,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = useAuthUserStore.getState().user?.token;
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          useAuthUserStore.getState().clearUser();
          navigate('/login');
        }
      },
    ],
  },
});
