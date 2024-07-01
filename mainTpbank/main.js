const axios = require("axios");
const moment = require('moment-timezone');
async function handleLogin(username, password, deviceId) {
  const data = {
    username,
    password,
    step_2FA: "VERIFY",
    deviceId,
    transactionId: "",
  };

  const config = {
    headers: {
      APP_VERSION: "2024.06.28",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "vi",
      Authorization: "Bearer",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      DEVICE_ID: deviceId,
      DEVICE_NAME: "Chrome",
      Origin: "https://ebank.tpb.vn",
      PLATFORM_NAME: "WEB",
      PLATFORM_VERSION: "126",
      Referer: "https://ebank.tpb.vn/retail/vX/",
      SOURCE_APP: "HYDRO",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
  };

  try {
    const response = await axios.post(
      "https://ebank.tpb.vn/gateway/api/auth/login/v3",
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function getHistories(token, accountId, deviceId) {
  const fromDate = moment()
    .tz('Asia/Ho_Chi_Minh')
    .subtract(14, 'days')
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
      APP_VERSION: "2024.06.28",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
      Authorization: `Bearer ${token}`,
      Connection: "keep-alive",
      "Content-Type": "application/json",
      DEVICE_ID: deviceId,
      DEVICE_NAME: "Chrome",
      Origin: "https://ebank.tpb.vn",
      PLATFORM_NAME: "WEB",
      PLATFORM_VERSION: "126",
      SOURCE_APP: "HYDRO",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "sec-ch-ua":
        '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
    },
  };

  try {
    const response = await axios.post(
      "https://ebank.tpb.vn/gateway/api/smart-search-presentation-service/v2/account-transactions/find",
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}


module.exports = { handleLogin, getHistories };
