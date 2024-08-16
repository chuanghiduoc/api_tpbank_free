const axios = require("axios");
const moment = require('moment-timezone');
const { getAgent } = require('./proxyAgent');


async function handleLogin(username, password, deviceId) {
  const cfAgent = getAgent();
  if (cfAgent) this.cfAgent = cfAgent;

  const data = {
    username,
    password,
    deviceId,
    transactionId: "",
  };

  const config = {
    headers: {
      APP_VERSION: "2024.07.12",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "vi",
      Authorization: "Bearer",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      DEVICE_ID: deviceId,
      DEVICE_NAME: "Chrome",
      Origin: "https://ebank.tpb.vn",
      PLATFORM_NAME: "WEB",
      PLATFORM_VERSION: "127",
      Referer: "https://ebank.tpb.vn/retail/vX/",
      SOURCE_APP: "HYDRO",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
    httpsAgent: this.cfAgent,
  };
  // console.log('Login httpsAgent:', config.httpsAgent);
  try {
    const response = await axios.post('https://ebank.tpb.vn/gateway/api/auth/login/v3', data, config,);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getHistories(token, accountId, deviceId, username, password) {
  const days = process.env.DAYS || 30;

  const fromDate = moment()
    .tz('Asia/Ho_Chi_Minh')
    .subtract(days, 'days')
    .format('YYYYMMDD');
  const toDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDD');

  const data = {
    pageNumber: 1,
    pageSize: 400,
    accountNo: accountId,
    currency: "VND",
    maxAcentrysrno: "",
    fromDate: fromDate,
    toDate: toDate,
    keyword: "",
  };

  const config = {
    headers: {
      APP_VERSION: "2024.07.12",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
      Authorization: `Bearer ${token}`,
      Connection: "keep-alive",
      "Content-Type": "application/json",
      DEVICE_ID: deviceId,
      DEVICE_NAME: "Chrome",
      Origin: "https://ebank.tpb.vn",
      PLATFORM_NAME: "WEB",
      PLATFORM_VERSION: "127",
      SOURCE_APP: "HYDRO",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
    httpsAgent: this.cfAgent,
  };
  // console.log('Histories httpsAgent:', config.httpsAgent);
  try {
    const response = await axios.post(
      "https://ebank.tpb.vn/gateway/api/smart-search-presentation-service/v2/account-transactions/find",
      data,
      config,
    );
    return response.data;
  } catch (error) {
    // Nếu có lỗi và mã thông báo có thể đã hết hạn, hãy thử đăng nhập lại
    if (error.response && error.response.status === 401) {
      console.log("Mã thông báo đã hết hạn, đang đăng nhập lại...");
      try {
        const loginResponse = await handleLogin(username, password, deviceId);
        const newToken = loginResponse.access_token;
        return await getHistories(newToken, accountId, deviceId, username, password);
      } catch (loginError) {
        console.error("Đăng nhập lại không thành công:", loginError.message);
        throw loginError; // Ném lỗi nếu không thể đăng nhập lại
      }
    } else {
      throw error;
    }
  }
}


module.exports = { handleLogin, getHistories };
