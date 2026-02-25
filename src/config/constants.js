/**
 * API URLs
 */
const API_BASE_URL = 'https://ebank.tpb.vn';
const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/gateway/api/auth/login/v4/non-trust`,
  TRANSACTIONS: `${API_BASE_URL}/gateway/api/smart-search-presentation-service/v2/account-transactions/find`,
};

/**
 * Default headers for TPBank API requests
 */
const DEFAULT_HEADERS = {
  APP_VERSION: '2026.01.30',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'vi',
  Connection: 'keep-alive',
  'Content-Type': 'application/json',
  DEVICE_NAME: 'Chrome',
  Origin: API_BASE_URL,
  PLATFORM_NAME: 'WEB',
  PLATFORM_VERSION: '145',
  SOURCE_APP: 'HYDRO',
  USER_NAME: 'HYD',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
};

/**
 * Default values
 */
const DEFAULTS = {
  DAYS: 30,
  PAGE_SIZE: 400,
  CURRENCY: 'VND',
  TIMEZONE: 'Asia/Ho_Chi_Minh',
  PORT: 3000,
  TOKEN_REFRESH_BUFFER_SECONDS: 60, // Refresh token 60 seconds before expiry
};

module.exports = {
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  DEFAULTS,
};
