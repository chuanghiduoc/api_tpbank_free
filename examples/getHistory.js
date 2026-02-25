/**
 * Example: Lấy lịch sử giao dịch TPBank
 *
 * Cách chạy:
 *   1. Copy file .env.example thành .env và điền thông tin
 *   2. node examples/getHistory.js
 */

require('dotenv').config();
const { TPBankClient } = require('../src');

const { TPBANK_USERNAME, TPBANK_PASSWORD, TPBANK_DEVICE_ID, TPBANK_ACCOUNT_ID } = process.env;

if (!TPBANK_USERNAME || !TPBANK_PASSWORD || !TPBANK_DEVICE_ID || !TPBANK_ACCOUNT_ID) {
  console.error('Thiếu biến môi trường. Tạo file .env với nội dung:');
  console.error('  TPBANK_USERNAME=...');
  console.error('  TPBANK_PASSWORD=...');
  console.error('  TPBANK_DEVICE_ID=...');
  console.error('  TPBANK_ACCOUNT_ID=...');
  process.exit(1);
}

async function main() {
  const client = new TPBankClient({
    username: TPBANK_USERNAME,
    password: TPBANK_PASSWORD,
    deviceId: TPBANK_DEVICE_ID,
    accountId: TPBANK_ACCOUNT_ID,
  });

  console.log('Đang đăng nhập...');
  const loginResult = await client.login();
  console.log('Đăng nhập thành công! Token hết hạn sau', loginResult.expiresIn, 'giây');

  console.log('\nĐang lấy lịch sử giao dịch 7 ngày gần nhất...');
  const data = await client.getTransactionHistory({ days: 7 });

  if (!data.transactionInfos || data.transactionInfos.length === 0) {
    console.log('Không có giao dịch nào trong 7 ngày qua.');
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
