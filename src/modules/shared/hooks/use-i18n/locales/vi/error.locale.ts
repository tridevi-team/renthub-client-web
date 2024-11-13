export const errorLocale = {
  // #region Auth
  LOGIN_REQUIRED: 'Vui lòng đăng nhập để tiếp tục',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  TOKEN_INVALID: 'Token không hợp lệ, vui lòng đăng nhập lại',
  VERIFY_ACCOUNT_FIRST: 'Tài khoản chưa được xác minh Email',
  USER_ALREADY_EXISTS: 'Email đã được sử dụng, vui lòng chọn Email khác',
  INVALID_VERIFICATION_CODE: 'Mã xác thực không chính xác',
  GET_USER_NOT_FOUND: 'Người dùng không tồn tại',
  ACCOUNT_ALREADY_VERIFIED: 'Tài khoản đã được xác minh',
  INVALID_USER: 'Email hoặc mật khẩu không chính xác',
  INCORRECT_OLD_PASSWORD: 'Mật khẩu cũ không chính xác',
  ACCOUNT_DISABLED:
    'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ với quản trị viên',
  FAILED_EMAIL_VERIFICATION: 'Gửi mã xác minh email thất bại. Vui lòng thử lại',
  FAILED_CREATE_USER: 'Tạo người dùng thất bại',
  ACCOUNT_PREVIOUSLY_VERIFIED: 'Tài khoản đã được xác minh trước đó',
  // #endregion

  // #region House
  NO_HOUSES_FOUND: 'Không tìm thấy nhà',
  HOUSE_ALREADY_EXISTS: 'Nhà đã tồn tại',
  HOUSE_NOT_FOUND: 'Không tìm thấy nhà',
  UPDATE_HOUSE_FAIL: 'Cập nhật nhà thất bại',
  DELETE_HOUSE_FAIL: 'Xóa nhà thất bại',
  UPDATE_HOUSE_STATUS_FAIL: 'Cập nhật trạng thái nhà thất bại',
  // #endregion

  // #region Role
  ROLE_NAME_ALREADY_EXISTS: 'Tên vai trò đã tồn tại',
  ROLE_NOT_FOUND: 'Không tìm thấy vai trò',
  UPDATE_ROLE_ERROR: 'Lỗi xảy ra khi cập nhật vai trò',
  HOUSE_NO_ROLE_CREATED: 'Nhà chưa tạo bất kỳ vai trò nào',
  DELETE_ROLE_ERROR: 'Lỗi xảy ra khi xóa vai trò',
  CANNOT_ASSIGN_ROLE_TO_SELF: 'Bạn không thể gán vai trò cho chính mình',
  CANNOT_ASSIGN_ROLE_TO_HOUSE_OWNER: 'Bạn không thể gán vai trò cho chủ nhà',
  CANNOT_DELETE_ROLE_ASSIGNED_TO_USER:
    'Không thể xóa vai trò vì nó đã được gán cho người dùng khác',
  // #endregion

  // #region Room
  ROOM_ALREADY_EXISTS: 'Phòng đã tồn tại',
  ROOM_NOT_FOUND: 'Không tìm thấy phòng',
  NO_ROOMS_FOUND: 'Không tìm thấy phòng',
  CREATE_ROOM_FAIL: 'Tạo phòng thất bại',
  // #endregion

  // #region Renter
  RENTER_ALREADY_EXISTS: 'Người thuê đã tồn tại trong phòng này',
  RENTER_NOT_FOUND: 'Không tìm thấy người thuê',
  NO_RENTERS_FOUND: 'Không tìm thấy người thuê',
  CHANGE_REPRESENT_BEFORE_DELETE: 'Vui lòng thay đổi đại diện trước khi xóa',
  // #endregion

  // #region Code Verification
  VERIFY_CODE_FAIL: 'Xác minh mã thất bại',
  // #endregion

  // #region Floor
  FLOOR_ALREADY_EXISTS: 'Tầng đã tồn tại',
  FLOOR_NOT_FOUND: 'Không tìm thấy tầng',
  NO_FLOORS_FOUND: 'Không tìm thấy tầng',
  // #endregion

  // #region Service
  SERVICE_ALREADY_EXISTS: 'Dịch vụ đã tồn tại',
  SERVICE_NOT_FOUND: 'Không tìm thấy dịch vụ',
  NO_SERVICES_FOUND: 'Không tìm thấy dịch vụ',
  // #endregion

  // #region Equipment
  EQUIPMENT_NOT_FOUND: 'Không tìm thấy thiết bị',
  EQUIPMENT_ALREADY_EXISTS: 'Thiết bị đã tồn tại',
  // #endregion

  // #region Payment Method
  PAYMENT_METHOD_NOT_FOUND: 'Không tìm thấy phương thức thanh toán',
  NO_PAYMENT_METHODS_FOUND: 'Không tìm thấy phương thức thanh toán',
  PAYMENT_METHOD_ALREADY_EXISTS: 'Phương thức thanh toán đã tồn tại',
  PAYMENT_METHOD_DEFAULT_STATUS:
    'Không thể thay đổi trạng thái phương thức thanh toán mặc định',
  PAYMENT_CANCELLED: 'Thanh toán đã bị hủy',
  // #endregion

  // #region Issue
  ISSUE_NOT_FOUND: 'Không tìm thấy vấn đề',
  NO_ISSUES_FOUND: 'Không tìm thấy vấn đề',
  // #endregion

  // #region Bill
  NO_BILLS_FOUND: 'Không tìm thấy hóa đơn',
  BILL_NOT_FOUND: 'Không tìm thấy hóa đơn',
  BILL_EXISTS: 'Hóa đơn đã tồn tại',
  BILL_STATUS_PAID_OR_CANCELLED:
    'Không thể cập nhật trạng thái hóa đơn vì nó đã được thanh toán hoặc hủy',
  // #endregion

  // #region Notification
  NO_NOTIFICATIONS_FOUND: 'Không tìm thấy thông báo',
  NOTIFICATION_NOT_FOUND: 'Không tìm thấy thông báo',
  // #endregion

  // #region General
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại',
  UNKNOWN_ERROR: 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
  OOPS: 'Oops!',
  SOMETHING_WENT_WRONG: 'Có lỗi xảy ra khi tải dữ liệu',
  ID_REQUIRED: 'ID không được để trống',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  NOT_PERMISSION: 'Bạn không có quyền truy cập',
  // #endregion
} as const;

export type ErrorLocale = keyof typeof errorLocale;
