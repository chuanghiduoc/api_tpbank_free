/**
 * Example: Lấy lịch sử giao dịch TPBank
 *
 * Cách chạy:
 *   1. Copy file .env.example thành .env và điền thông tin
 *   2. node examples/getHistory.js
 */

require('dotenv').config();
const { TPBankClient } = require('../src');

const {
  TPBANK_USERNAME,
  TPBANK_PASSWORD,
  DEVICE_ID,
  ACCOUNT_ID,
  DAYS = '7',
  PROXY_SCHEMA,
  PROXY_IP,
  PROXY_PORT,
  PROXY_USERNAME,
  PROXY_PASSWORD,
} = process.env;

if (!TPBANK_USERNAME || !TPBANK_PASSWORD || !DEVICE_ID || !ACCOUNT_ID) {
  console.error('Thiếu biến môi trường. Copy .env.example thành .env và điền thông tin.');
  process.exit(1);
}

async function main() {
  const config = {
    username: TPBANK_USERNAME,
    password: TPBANK_PASSWORD,
    deviceId: DEVICE_ID,
    accountId: ACCOUNT_ID,
  };

  // Thêm proxy nếu có cấu hình
  if (PROXY_IP && PROXY_PORT) {
    config.proxy = {
      schema: PROXY_SCHEMA || 'http',
      host: PROXY_IP,
      port: Number(PROXY_PORT),
      username: PROXY_USERNAME || undefined,
      password: PROXY_PASSWORD || undefined,
    };
    console.log(`Sử dụng proxy: ${config.proxy.schema}://${PROXY_IP}:${PROXY_PORT}`);
  }

  const client = new TPBankClient(config);

  console.log('Đang đăng nhập...');
  const loginResult = await client.login();
  console.log('Đăng nhập thành công! Token hết hạn sau', loginResult.expiresIn, 'giây');

  const days = Number(DAYS);
  console.log(`\nĐang lấy lịch sử giao dịch ${days} ngày gần nhất...`);
  const data = await client.getTransactionHistory({ days });

  if (!data.transactionInfos || data.transactionInfos.length === 0) {
    console.log(`Không có giao dịch nào trong ${days} ngày qua.`);
    return;
  }

  console.log(`Tìm thấy ${data.transactionInfos.length} giao dịch:\n`);
  for (const tx of data.transactionInfos) {
    const amount = Number(tx.amount).toLocaleString('vi-VN');
    const sign = tx.type === 'Credit' ? '+' : '-';
    console.log(`  ${tx.id} | ${sign}${amount} VND | ${tx.description}`);
  }
}

main().catch((err) => {
  console.error('Lỗi:', err.message);
  process.exit(1);
});
