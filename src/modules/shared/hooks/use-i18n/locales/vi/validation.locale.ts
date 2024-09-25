export const validationLocale = {
  vld_required: '{{field}} không được để trống',
  vld_invalidType: '{{field}} không đúng định dạng',
  vld_email: '{{field}} không đúng định dạng email',
  vld_phoneNumber: 'Số điện thoại không hợp lệ',
  vld_password: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
  vld_min: '{{field}} không được nhỏ hơn {{min}}',
  vld_max: '{{field}} không được lớn hơn {{max}}',
  vld_minLength: '{{field}} phải có ít nhất {{min}} ký tự',
  vld_maxLength: '{{field}} chỉ được dài tối đa {{max}} ký tự',
  vld_confirm: '{{field}} không khớp',
} as const;
