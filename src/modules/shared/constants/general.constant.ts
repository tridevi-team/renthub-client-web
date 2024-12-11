export const BRAND_NAME = 'Trọ đây!';
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

export const CONTRACT_TEMPLATE_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

export const CONTRACT_TEMPLATE_STATUS_OPTIONS = [
  { label: 'Đang sử dụng', value: 'ACTIVE' },
  { label: 'Ngừng sử dụng', value: 'INACTIVE' },
];

export const ISSUE_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CLOSED: 'CLOSED',
};

export const ISSUE_STATUS_OPTIONS = [
  { label: 'Mở', value: 'OPEN' },
  { label: 'Đang xử lý', value: 'IN_PROGRESS' },
  { label: 'Hoàn thành', value: 'DONE' },
  { label: 'Đóng', value: 'CLOSED' },
];

export const CONTRACT_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  TERMINATED: 'TERMINATED',
  HOLD: 'HOLD',
};

export const CONTRACT_STATUS_OPTIONS = [
  { label: 'Chờ ký', value: 'PENDING' },
  { label: 'Đang hoạt động', value: 'ACTIVE' },
  { label: 'Hết hạn', value: 'EXPIRED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
  { label: 'Đã chấm dứt', value: 'TERMINATED' },
  { label: 'Tạm dừng', value: 'HOLD' },
];

export const DEPOSIT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
  DEDUCTED: 'DEDUCTED',
  CANCELLED: 'CANCELLED',
};

export const DEPOSIT_STATUS_OPTIONS = [
  { label: 'Chờ thanh toán', value: 'PENDING' },
  { label: 'Đã thanh toán', value: 'PAID' },
  { label: 'Đã hoàn trả', value: 'REFUNDED' },
  { label: 'Đã trừ', value: 'DEDUCTED' },
  { label: 'Đã hủy', value: 'CANCELLED' },
];

export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const APPROVAL_STATUS_OPTIONS = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Đã từ chối', value: 'REJECTED' },
];

export const DOM_PURIFY_ALLOWED_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'span',
  'br',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'table',
  'tr',
  'td',
  'th',
  'thead',
  'tbody',
];

export const DOM_PURIFY_ALLOWED_ATTR = ['class', 'style'];
