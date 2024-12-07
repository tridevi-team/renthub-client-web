import { http } from '@shared/services/http.service';
import { getHouseSelected } from '@shared/utils/helper.util';

export type statsParams = {
  from: string;
  to: string;
  modules?: string[];
};

export type StatsCountResponseSchema = {
  success: boolean;
  code?: string;
  message?: string;
  data: {
    [key: string]: any;
  };
};

// from, to: YYYY-MM-DD

export const statsRepositories = {
  count: async ({ from, to, modules }: statsParams) => {
    const searchParams: [string, string | number | boolean][] = [];
    searchParams.push(['from', from]);
    searchParams.push(['to', to]);
    if (modules) {
      for (const module of modules) {
        searchParams.push(['modules[]', module]);
      }
    }
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`statistical/${houseId}/count`, {
        searchParams,
      })
      .json<StatsCountResponseSchema>();

    return resp;
  },
  chart: async ({ from, to, modules }: statsParams) => {
    const searchParams: [string, string | number | boolean][] = [];
    searchParams.push(['from', from]);
    searchParams.push(['to', to]);
    if (modules) {
      for (const module of modules) {
        searchParams.push(['modules[]', module]);
      }
    }
    const houseId = getHouseSelected()?.id;
    const resp = await http.instance
      .get(`statistical/${houseId}/chart`, {
        searchParams,
      })
      .json<StatsCountResponseSchema>();

    return resp;
  },
};
