export const errorLocale = {
  er_401: 'Vui lòng đăng nhập để tiếp tục',
  UNKNOWN_ERROR: 'Có lỗi xảy ra, vui lòng thử lại',
} as const;

export type ErrorLocale = keyof typeof errorLocale;
