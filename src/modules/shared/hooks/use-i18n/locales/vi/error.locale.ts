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
  // #endregion

  VALIDATION_ERROR: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại',
  UNKNOWN_ERROR: 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
  OOPS: 'Oops! Đã xảy ra lỗi',
  SOMETHING_WENT_WRONG: 'Có lỗi xảy ra khi tải dữ liệu',
} as const;

export type ErrorLocale = keyof typeof errorLocale;
