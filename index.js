const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { getDeviceId } = require("./utils.js");
const { handleLogin, getHistories } = require("./mainTpbank/main");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const deviceId = getDeviceId();
    if (deviceId) this.deviceId = deviceId;
    const login = await handleLogin(username, password, deviceId);
    return res.json({ accessToken: login.access_token });
  } catch (error) {
    res.json({error : error.data})
  }
});

app.post("/histories", async (req, res) => {
  try {
    const { accessToken, accountId, fromDate, toDate } = req.body;
    const histories = await getHistories(accessToken, accountId, fromDate, toDate, this.deviceId);
    //Lấy dữ liệu ở trường creditDebitIndicator = CRDT (Nhận tiền), DBIT(Chuyển tiền đi) 
    const filteredTransactions = histories.transactionInfos.filter(transaction => transaction.creditDebitIndicator === 'CRDT');
    //Lọc và loại bỏ dữ liệu có trường Category
    const transactionsWithoutCategory = filteredTransactions.map(({ category, ...transaction }) => transaction);
    return res.json({ info: transactionsWithoutCategory });
  } catch (error) {
    res.json({ error: error.data });
  }
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}!`);
});
