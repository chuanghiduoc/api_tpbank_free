# Changelog

## [2.1.0] - 2025-02-25

### Changed
- Cập nhật login endpoint từ `v3` sang `v4/non-trust`
- Cập nhật headers API: `APP_VERSION` (2026.01.30), `PLATFORM_VERSION` (145), `User-Agent` (Chrome 145), `Accept-Language` (vi)
- Tích hợp `TokenExpiredError` vào retry logic khi token 401 hết hạn và re-login thất bại
- Tích hợp `clear()` vào flow xử lý token hết hạn để reset token sạch trước khi retry

### Added
- Thêm header `USER_NAME: HYD` vào default headers

### Removed
- Xóa class `ValidationError` không sử dụng khỏi `errors.js`
- Xóa export `API_BASE_URL` không cần thiết khỏi `constants.js`
