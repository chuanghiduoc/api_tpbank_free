const express = require("express");
const bodyParser = require("body-parser");
const { handleLogin, getHistories } = require("./mainTpbank/main");
const cors = require("cors");

let accessToken = null;

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/login", async (req, res) => {
  try {
    const { username, password, deviceId } = req.body;
    const login = await handleLogin(username, password, deviceId);
    return res.json({ accessToken: login });
  } catch (error) {
    res.json({error : error.data})
  }
});

app.post("/histories", async (req, res) => {
  try {    
    const username = req.body.username || process.env.USERNAME;
    const password = req.body.password || process.env.PASSWORD;
    const deviceId = req.body.deviceId || process.env.DEVICE_ID;
    const accountId = req.body.accountId || process.env.ACCOUNT_ID;

    if (!username || !password || !deviceId || !accountId) {
      return res.status(400).json({ error: "Thiếu tham số bắt buộc" });
    }

    // Nếu chưa có token hoặc token đã hết hạn thì đăng nhập lại
    if (!accessToken) {
      console.log('Token hết hạn hoặc chưa có, đang đăng nhập lại...');
      const loginResponse = await handleLogin(username, password, deviceId);
      accessToken = loginResponse.access_token;
    }
    console.log(accessToken);

    // Lấy lịch sử giao dịch sử dụng token từ đăng nhập
    const histories = await getHistories(accessToken, accountId, deviceId);

    //Lấy dữ liệu ở trường creditDebitIndicator = CRDT (Cộng tiền), DBIT(Trừ tiền) 
    // const filteredTransactions = histories.transactionInfos.filter(transaction => transaction.creditDebitIndicator === 'CRDT');
    // //Lọc và loại bỏ dữ liệu có trường Category
    // const transactionsWithoutCategory = filteredTransactions.map(({ category, ...transaction }) => transaction);
    return res.json({ info: histories });
  } catch (error) {
    return res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}!`);
});
