const axios = require("axios");
const moment = require('moment-timezone');
const { HttpsProxyAgent } = require('https-proxy-agent');

let accessToken = null;
let clearAccessTokenTimeout = null;

//Thêm proxy vào để tránh bị block, kèm nó vào trong req (config) là được
function getAgent() {
  const proxy = {
    schema: process.env.PROXY_SCHEMA,
    ip: process.env.PROXY_IP,
    port: process.env.PROXY_PORT,
    username: process.env.PROXY_USERNAME,
    password: process.env.PROXY_PASSWORD,
  };

  if (!proxy.schema || !proxy.ip || !proxy.port || !proxy.username || !proxy.password) {
    console.log("Thiếu config proxy");
  }
  const proxyUrl = proxy.username && proxy.username.length > 0
    ? `${proxy.schema}://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
    : `${proxy.schema}://${proxy.ip}:${proxy.port}`;

  const httpsAgent = new HttpsProxyAgent(proxyUrl);

  // console.log("httpsAgent configuration:", httpsAgent);

  return httpsAgent;
}

async function handleLogin(username, password, deviceId) {
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
  };

  try {
    const response = await axios.post('https://ebank.tpb.vn/gateway/api/auth/login/v3', data, { ...config, httpsAgent: getAgent() },);
    accessToken = response.data.access_token;

    if (clearAccessTokenTimeout) {
      clearTimeout(clearAccessTokenTimeout);
    }

    // Đặt thời gian chờ để xóa accessToken ngay trước khi hết hạn
    clearAccessTokenTimeout = setTimeout(() => {
      accessToken = null;
    }, (response.data.expires_in - 10) * 1000);

    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getHistories(token, accountId, deviceId) {
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
  };

  try {
    const response = await axios.post(
      "https://ebank.tpb.vn/gateway/api/smart-search-presentation-service/v2/account-transactions/find",
      data,
      { ...config, httpsAgent: getAgent() },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}


module.exports = { handleLogin, getHistories };
