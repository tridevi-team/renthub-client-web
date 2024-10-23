import type { Option } from '@app/types';
import ky from 'ky';
import z from 'zod';

const cityResponseSchema = z.array(
  z.object({
    name: z.string(),
    code: z.number(),
  }),
);
const getCityByCodeResponseSchema = z.object({
  name: z.string(),
  code: z.number(),
  districts: z.array(
    z.object({
      name: z.string(),
      code: z.number(),
    }),
  ),
});
const getDistrictByCodeResponseSchema = z.object({
  name: z.string(),
  code: z.number(),
  wards: z.array(
    z.object({
      name: z.string(),
      code: z.number(),
    }),
  ),
});

type CityResponseSchema = z.infer<typeof cityResponseSchema>;
type GetCityByCodeResponseSchema = z.infer<typeof getCityByCodeResponseSchema>;
type GetDistrictByCodeResponseSchema = z.infer<
  typeof getDistrictByCodeResponseSchema
>;

export const provinceRepositories = {
  city: async () => {
    let resp = await ky
      .get('https://provinces.tmquang.com/api/p')
      .json<CityResponseSchema>();
    resp = cityResponseSchema.parse(resp);

    const result: Option[] = resp.map((item) => {
      return {
        value: item.name,
        label: item.name,
        code: item.code,
      };
    });
    return result;
  },
  district: async (selectedCityCode: string | number | undefined) => {
    let resp = await ky
      .get(`https://provinces.tmquang.com/api/p/${selectedCityCode}?depth=2`)
      .json<GetCityByCodeResponseSchema>();
    resp = getCityByCodeResponseSchema.parse(resp);

    const result: Option[] = resp.districts.map((item) => {
      return {
        value: item.name,
        label: item.name,
        code: item.code,
      };
    });

    return result;
  },
  ward: async (selectedDistrictCode: string | number | undefined) => {
    let resp = await ky
      .get(
        `https://provinces.tmquang.com/api/d/${selectedDistrictCode}?depth=2`,
      )
      .json<GetDistrictByCodeResponseSchema>();
    resp = getDistrictByCodeResponseSchema.parse(resp);

    const result: Option[] = resp.wards.map((item) => {
      return {
        value: item.name,
        label: item.name,
        code: item.code,
      };
    });

    return result;
  },
};
