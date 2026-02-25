# @chuanghiduoc/tpbank

[![npm version](https://img.shields.io/npm/v/@chuanghiduoc/tpbank)](https://www.npmjs.com/package/@chuanghiduoc/tpbank)

TPBank API client cho Node.js - Lấy lịch sử giao dịch TPBank.

## Cài đặt

```bash
npm install @chuanghiduoc/tpbank
```

## Lấy Device ID

1. Mở trình duyệt đã từng đăng nhập xác minh khuôn mặt
2. Vào trang https://ebank.tpb.vn/retail/vX/ và đăng nhập
3. Bấm F12, tab Console, paste đoạn code sau:
   ```js
   localStorage.deviceId
   ```
4. Copy giá trị trả về và sử dụng trong code

## Sử dụng

```js
const { TPBankClient } = require('@chuanghiduoc/tpbank');

const client = new TPBankClient({
  username: 'your_username',
  password: 'your_password',
  deviceId: 'your_device_id',
  accountId: 'your_account_id',
});

// Lấy lịch sử giao dịch (tự động login nếu chưa có token)
const data = await client.getTransactionHistory();
console.log(data);
```

### ESM

```js
import { TPBankClient } from '@chuanghiduoc/tpbank';
```

## API

### `new TPBankClient(credentials)`

Tạo client mới.

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `username` | `string` | Có | Tên đăng nhập TPBank |
| `password` | `string` | Có | Mật khẩu đăng nhập |
| `deviceId` | `string` | Có | Device ID lấy từ trình duyệt |
| `accountId` | `string` | Có | Số tài khoản TPBank |
| `proxy` | `ProxyConfig` | Không | Cấu hình proxy (xem bên dưới) |

### `client.login()`

Đăng nhập và lấy access token. Trả về `Promise<LoginResult>`.

```js
const result = await client.login();
// { accessToken: '...', expiresIn: 900, expiresAt: 1234567890 }
```

### `client.getTransactionHistory(options?)`

Lấy lịch sử giao dịch. Tự động gọi `login()` nếu chưa có token hợp lệ.

| Option | Kiểu | Mặc định | Mô tả |
|--------|------|----------|-------|
| `days` | `number` | `30` | Số ngày lấy lịch sử |
| `pageNumber` | `number` | `1` | Trang |
| `pageSize` | `number` | `400` | Số giao dịch mỗi trang |
| `keyword` | `string` | `''` | Từ khóa tìm kiếm |

```js
const data = await client.getTransactionHistory({
  days: 7,
  pageNumber: 1,
  pageSize: 100,
  keyword: 'chuyen tien',
});
```

### `client.isTokenValid()`

Kiểm tra token hiện tại còn hợp lệ không. Trả về `boolean`.

### `client.clear()`

Xóa token đã lưu.

## Proxy

```js
const client = new TPBankClient({
  username: 'your_username',
  password: 'your_password',
  deviceId: 'your_device_id',
  accountId: 'your_account_id',
  proxy: {
    schema: 'http',
    host: '127.0.0.1',
    port: 8080,
    username: 'proxy_user',     // optional
    password: 'proxy_pass',     // optional
  },
});
```

## Xử lý lỗi

```js
const { TPBankClient, AuthenticationError, TokenExpiredError, TPBankError } = require('@chuanghiduoc/tpbank');

try {
  const data = await client.getTransactionHistory();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Lỗi đăng nhập:', error.message);
  } else if (error instanceof TokenExpiredError) {
    console.error('Token hết hạn:', error.message);
  } else if (error instanceof TPBankError) {
    console.error('Lỗi API:', error.message, error.statusCode);
  }
}
```

## Release (cho maintainer)

Package được tự động publish lên npm thông qua GitHub Actions khi push tag `v*.*.*`.

```bash
# Bump version + tạo tag + push → auto publish lên npm
npm run release:patch   # 1.0.0 → 1.0.1
npm run release:minor   # 1.0.0 → 1.1.0
npm run release:major   # 1.0.0 → 2.0.0
```

Hoặc thủ công:

```bash
npm version patch
git push && git push --tags
```

### Setup lần đầu

Thêm secret `NPM_TOKEN` vào GitHub repo:

1. Tạo Access Token tại [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens) (type: **Automation**)
2. Vào repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Name: `NPM_TOKEN`, Value: token vừa tạo

## Miễn trừ trách nhiệm

- Mã nguồn được công khai, cho phép xem, sửa đổi, và cải thiện.
- Được phép sử dụng vào mục đích thương mại: tạo cổng thanh toán, thông báo giao dịch,...
- Không sử dụng thương mại: mở các dịch vụ tương tự Casso.vn
- Dịch vụ sử dụng API không chính thức của TPBank. Người phát triển không chịu trách nhiệm cho bất kỳ vấn đề pháp lý nào phát sinh.
