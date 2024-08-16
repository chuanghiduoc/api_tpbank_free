const express = require("express");
const bodyParser = require("body-parser");
const { handleLogin, getHistories } = require("./mainTpbank/main");
const cors = require("cors");

let accessToken = null;
let refreshTokenTimeout = null; 
let accessTokenExpiry = null;

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
    if (!accessToken || Date.now() >= accessTokenExpiry) {
      console.log('Token hết hạn hoặc chưa có, đang đăng nhập lại...');
      const loginResponse = await handleLogin(username, password, deviceId);
      accessToken = loginResponse.access_token;
      accessTokenExpiry = Date.now() + (loginResponse.expires_in - 10) * 1000;
      // Đặt thời gian chờ để làm mới token
      if (refreshTokenTimeout) {
        clearTimeout(refreshTokenTimeout);
      }
      refreshTokenTimeout = setTimeout(async () => {
        try {
          console.log('Token hết hạn, đang đăng nhập lại...');
          const newLoginResponse = await handleLogin(username, password, deviceId);
          accessToken = newLoginResponse.access_token;
          accessTokenExpiry = Date.now() + (newLoginResponse.expires_in - 10) * 1000;
        } catch (error) {
          console.error('Lỗi khi làm mới token:', error.message);
        }
      }, (loginResponse.expires_in - 10) * 1000);
    }
    console.log(accessToken);

    // Lấy lịch sử giao dịch sử dụng token từ đăng nhập
    const histories = await getHistories(accessToken, accountId, deviceId, username, password);

    return res.json({ info: histories });
  } catch (error) {
    return res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}!`);
});
