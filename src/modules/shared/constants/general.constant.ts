export const BRAND_NAME = 'RentHub';
export const PREFIX_FLOOR_NAME = 'Tầng';
export const GENDER_OPTIONS = [
  { label: 'Nam', value: 'male' },
  { label: 'Nữ', value: 'female' },
  { label: 'Khác', value: 'other' },
];
export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY';

export const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Bình thường', value: 'NORMAL' },
  { label: 'Hỏng', value: 'BROKEN' },
  { label: 'Đang sửa', value: 'REPAIRING' },
  { label: 'Đã thanh lý', value: 'DISPOSED' },
];

export const EQUIPMENT_STATUS = {
  NORMAL: 'NORMAL',
  BROKEN: 'BROKEN',
  REPAIRING: 'REPAIRING',
  DISPOSED: 'DISPOSED',
};

export const EQUIPMENT_SHARED_TYPE_OPTIONS = [
  { label: 'Chung theo nhà', value: 'HOUSE' },
  { label: 'Riêng theo phòng', value: 'ROOM' },
];

export const EQUIPMENT_SHARED_TYPE = {
  HOUSE: 'HOUSE',
  ROOM: 'ROOM',
};

export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  RENTED: 'RENTED',
  PENDING: 'PENDING',
  MAINTENANCE: 'MAINTENANCE',
  EXPIRED: 'EXPIRED',
};

export const ROOM_STATUS_OPTIONS = [
  { label: 'Còn trống', value: 'AVAILABLE' },
  { label: 'Đã thuê', value: 'RENTED' },
  { label: 'Đang chờ', value: 'PENDING' },
  { label: 'Bảo trì', value: 'MAINTENANCE' },
  { label: 'Tạm dừng', value: 'EXPIRED' },
];

export const DEFAULT_RETURN_TABLE_DATA = {
  page: 0,
  pageSize: 0,
  pageCount: 0,
  total: 0,
  results: [],
};

export const SERVICE_TYPES = {
  PEOPLE: 'PEOPLE',
  ROOM: 'ROOM',
  WATER_CONSUMPTION: 'WATER_CONSUMPTION',
  ELECTRICITY_CONSUMPTION: 'ELECTRICITY_CONSUMPTION',
  INDEX: 'INDEX',
};

export const SERVICE_MEAUSRE_UNITS = {
  PEOPLE: 'Người',
  ROOM: 'Phòng',
  WATER_CONSUMPTION: 'm3',
  ELECTRICITY_CONSUMPTION: 'kWh',
  OTHER: 'Chỉ số',
};

export const TYPE_INDEX = {
  ELECTRICITY_CONSUMPTION: 'ELECTRICITY_CONSUMPTION',
  WATER_CONSUMPTION: 'WATER_CONSUMPTION',
  OTHER: 'OTHER',
};

export const SERVICE_TYPE_OPTIONS = [
  { label: 'Người', value: 'PEOPLE' },
  { label: 'Phòng', value: 'ROOM' },
  { label: 'Chỉ số', value: 'INDEX' },
];

export const TYPE_INDEX_OPTIONS = [
  { label: 'Chỉ số điện', value: 'ELECTRICITY_CONSUMPTION' },
  { label: 'Chỉ số nước', value: 'WATER_CONSUMPTION' },
  // { label: 'Chỉ số khác', value: 'OTHER' },
];
