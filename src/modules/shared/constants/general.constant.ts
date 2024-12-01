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
