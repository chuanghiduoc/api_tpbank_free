# API lấy lịch sử giao dịch cho Tpbank
![api_tpbank_free](https://socialify.git.ci/chuanghiduoc/api_tpbank_free/image?description=1&descriptionEditable=API%20n%C3%A0y%20cung%20c%E1%BA%A5p%20c%C3%A1c%20endpoint%20%C4%91%E1%BB%83%20l%E1%BA%A5y%20l%E1%BB%8Bch%20s%E1%BB%AD%20giao%20d%E1%BB%8Bch%20cho%20kh%C3%A1ch%20h%C3%A0ng%20c%E1%BB%A7a%20Tpbank.&font=Inter&forks=1&issues=1&language=1&name=1&owner=1&pattern=Plus&pulls=1&stargazers=1&theme=Auto)

## Giới thiệu
API này cung cấp các endpoint để lấy lịch sử giao dịch cho khách hàng của Tpbank.

## Authentication
API yêu cầu sử dụng phương thức xác thực OAuth 2.0. Bạn cần cung cấp token được cấp phép để truy cập các endpoint.

## Endpoint
### Lấy token
`POST /login`

#### Tham số
- `username` (Tên đăng nhập)
- `password` (Mật khẩu)
```json
{
    "username": "Tên đăng nhập tpbank",
    "password": "Mật khẩu đăng nhập"
}
```
#### Phản hồi
```json
{
    "accessToken": "eyJraWQiOiJNYmV1VmEVWlhVT2FJcDgwYmx1XC9sanFOQjNKZE9aSDgxQ3JGU0tpMmVcL2M9IiwiY3R5IjoiSldUIiwiZW5jIjoiQTEyOENCQy1IUzI1NiIsImFsZyI6ImRpciJ9..xXU7xUbrz3QGRp--hc1QRg.fy59WI58F9y_ffjk5uRTiNajMRtYs7fa4v8LBTlKMGgtep2cZZZX2fl7XL5wwF6Xb2ruRVJvBGsCNu2EhPaKGwRJKdVv-8GucvGeZHLehImaivDYgnjNAf__Q0L2YOglsT8E874yfCJIiWNeSN9PO8TnbOCUT7mzr-dXYE_qZTontmsZKdTNDzuKkKjABVbKmGGb5Yq-HSWviY7t1xVhVRictPjJ084eUKoRfrAeamu6WI4nCDj1UQT_PuNXS_38g62MyB_6BYbGfyrudkV3VXy7jccpV0n4ey2i_Tx6IBP7dB7OLcAvH61GWd3b9llK0lRKgSLOtkBuMWFoOav7v4xiMln9JTJt-2ANpkJ_IwPZKesUOvp5DrryC6tzHBHYLeON8e6nvxBS-tbFoFJOfSu9FB1VEC19M1ORG1TUTqvz5KtJXhiw0S-As9C6JHlnwQi4_XGs9nZjJZWzqCmfLADSayQVlgvTxPiGOlFOUa5dmdiK8ramFK8YsYDWRs-30dfr_i8FCcWU24ckbEA1j7-o6b6InmZxLzzk2uJ7o3Qwjx325NKZWQl13PB94fnr.mQpLSJGWEA2sXJFuwdHfsQ"
}
```
### Lấy lịch sử giao dịch
`POST /histories`

#### Tham số
- `accessToken` (Token vừa lấy được ở Login)
- `accountId` (Số tài khoản cần lấy lịch sử)
- `fromDate` (Lấy từ ngày)
- `toDate` (Đến ngày)
```json
{
    "accessToken": "Token sau khi login",
    "accountId": "Số tài khoản",
    "fromDate": "Định dạng năm tháng ngày: 20231002", 
    "toDate": "Định dạng năm tháng ngày: 20231002"
}
```
#### Phản hồi
```json
{
    "info": [
        {
            "id": "13712911687",
            "arrangementId": "26032004888,VND-1709897676349-59441584efada96c14c0859ef115e5b124201e8e0960037a02d62a8da5496d68",
            "reference": "065V602240682698",
            "description": "LE VAN BAO TRONG  chuyen tien FT24068710833711",
            "bookingDate": "2024-03-08",
            "valueDate": "2024-03-08",
            "amount": "2000",
            "currency": "VND",
            "creditDebitIndicator": "CRDT",
            "runningBalance": "21000"
        },
        {
            "id": "13712903816",
            "arrangementId": "26032004888,VND-1709897676349-59441584efada96c14c0859ef115e5b124201e8e0960037a02d62a8da5496d68",
            "reference": "065V602240682227",
            "description": "LE VAN BAO TRONG  chuyen tien FT24068937678146",
            "bookingDate": "2024-03-08",
            "valueDate": "2024-03-08",
            "amount": "2000",
            "currency": "VND",
            "creditDebitIndicator": "CRDT",
            "runningBalance": "19000"
        },
        {
            "id": "13708274003",
            "arrangementId": "26032004888,VND-1709897676349-59441584efada96c14c0859ef115e5b124201e8e0960037a02d62a8da5496d68",
            "reference": "065ITC1240681599",
            "description": "MBVCB.5460022370.066210.LE VAN BAO TRONG chuyen tien.CT tu 1019535474 LE VAN BAO TRONG toi 26032004888 LE VAN BAO TRONG tai TPBANK",
            "bookingDate": "2024-03-08",
            "valueDate": "2024-03-08",
            "amount": "10000",
            "currency": "VND",
            "creditDebitIndicator": "CRDT",
            "runningBalance": "22000"
        },
        {
            "id": "13706804078",
            "arrangementId": "26032004888,VND-1709897676349-59441584efada96c14c0859ef115e5b124201e8e0960037a02d62a8da5496d68",
            "reference": "065V602240680300",
            "description": "LE VAN BAO TRONG  chuyen tien FT24068402245849",
            "bookingDate": "2024-03-08",
            "valueDate": "2024-03-08",
            "amount": "20000",
            "currency": "VND",
            "creditDebitIndicator": "CRDT",
            "runningBalance": "22000"
        },
        {
            "id": "13692255780",
            "arrangementId": "26032004888,VND-1709897676349-59441584efada96c14c0859ef115e5b124201e8e0960037a02d62a8da5496d68",
            "reference": "065V602240671224",
            "description": "LE VAN BAO TRONG  chuyen tien FT24067704078295",
            "bookingDate": "2024-03-07",
            "valueDate": "2024-03-07",
            "amount": "2000",
            "currency": "VND",
            "creditDebitIndicator": "CRDT",
            "runningBalance": "24000"
        },
        {
            "id": "13691901884",
            "arrangementId": "26032004888,VND-1709897676349-59441584efada96c14c0859ef115e5b124201e8e0960037a02d62a8da5496d68",
            "reference": "065V602240671193",
            "description": "LE VAN BAO TRONG  chuyen tien FT24067408869775",
            "bookingDate": "2024-03-07",
            "valueDate": "2024-03-07",
            "amount": "22000",
            "currency": "VND",
            "creditDebitIndicator": "CRDT",
            "runningBalance": "22000"
        }
    ]
}
```
## Yêu cầu cài đặt
- Cài Node.js bản 20.x trở lên

## Hướng dẫn chạy trên Localhost cho người mới
- Mở folder chứa code: có file index.js
- Mở terminal hoặc cmd tại thư mục đó, chạy lệnh
```json
    npm i
```
- Sau khi cài đặt hoàn tất chạy server lên bằng 
```json
    npm start
```
- Mặc định PORT là 3000 => Host = localhost:3000
- Dùng Postman hoặc các phần mềm tương tự để test với các endpoint là /login và /histories (ví dụ: localhost:3000/login) sau đó điền các tham số đầu vào và gửi để nhận response

## Bản quyền

- Mã nguồn của dịch vụ này được công khai, cho phép bất kỳ ai xem, sửa đổi, và cải thiện nó.
- Được phép sử dụng vào mục đích thương mại: tạo cổng thanh toán cho website, thông báo giao dịch cho nhân viện cửa hàng,...
- Không sử dụng thương mại: mở các dịch vụ tương tự Casso.vn

## Miễn trừ trách nhiệm

- **Miễn Trừ Trách Nhiệm Pháp Lý**: Người phát triển mã nguồn không chịu trách nhiệm pháp lý cho bất kỳ thiệt hại hay tổn thất nào xuất phát từ việc sử dụng hoặc không thể sử dụng dịch vụ.

- **Sử Dụng API Ngân Hàng Không Chính Thức**: Dịch vụ này hiện đang sử dụng các API của ngân hàng mà không có sự đồng ý chính thức từ các ngân hàng hoặc tổ chức tài chính liên quan. Do đó, người sáng lập và nhóm phát triển:
  - Không chịu trách nhiệm cho bất kỳ vấn đề pháp lý hoặc hậu quả nào phát sinh từ việc sử dụng các API này.
  - Không đảm bảo tính chính xác, độ tin cậy, hoặc tính sẵn có của dữ liệu lấy từ các API này.
  - Khuyến cáo người dùng cần cân nhắc rủi ro pháp lý và an toàn thông tin khi sử dụng dịch vụ.

**Ghi Chú Quan Trọng:**

- Việc sử dụng các API không chính thức này có thể vi phạm các quy định pháp lý và chính sách của ngân hàng.
- Chúng tôi khuyến khích người dùng và các bên liên quan cân nhắc kỹ lưỡng trước khi sử dụng dịch vụ này cho các mục đích tài chính hoặc thanh toán quan trọng.
- Người dùng nên tham khảo ý kiến từ chuyên gia pháp lý hoặc tài chính trước khi đưa ra quyết định dựa trên dữ liệu hoặc dịch vụ được cung cấp qua dịch vụ này.
