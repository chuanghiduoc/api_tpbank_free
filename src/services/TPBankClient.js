const axios = require('axios');
const moment = require('moment-timezone');
const { API_ENDPOINTS, DEFAULT_HEADERS, DEFAULTS } = require('../config/constants');
const { createProxyAgent } = require('../utils/proxyAgent');
const { AuthenticationError, TokenExpiredError, TPBankError } = require('../utils/errors');

/**
 * TPBank API Client
 * Handles authentication and transaction history retrieval
 */
class TPBankClient {
  constructor(credentials) {
    this.username = credentials.username;
    this.password = credentials.password;
    this.deviceId = credentials.deviceId;
    this.accountId = credentials.accountId;

    this.accessToken = null;
    this.tokenExpiry = null;
    this.proxyAgent = createProxyAgent();
  }

  /**
   * Check if current token is valid
   */
  isTokenValid() {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    // Add buffer time before actual expiry
    const bufferMs = DEFAULTS.TOKEN_REFRESH_BUFFER_SECONDS * 1000;
    return Date.now() < (this.tokenExpiry - bufferMs);
  }

  /**
   * Build headers for API requests
   */
  buildHeaders(token = null) {
    const headers = {
      ...DEFAULT_HEADERS,
      DEVICE_ID: this.deviceId,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      headers.Authorization = 'Bearer';
      headers.Referer = 'https://ebank.tpb.vn/retail/vX/';
    }

    return headers;
  }

  /**
   * Build axios config with optional proxy
   */
  buildAxiosConfig(headers) {
    const config = { headers };
    if (this.proxyAgent) {
      config.httpsAgent = this.proxyAgent;
    }
    return config;
  }

  /**
   * Login to TPBank and get access token
   */
  async login() {
    const data = {
      username: this.username,
      password: this.password,
      deviceId: this.deviceId,
      transactionId: '',
    };

    const headers = this.buildHeaders();
    const config = this.buildAxiosConfig(headers);

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, data, config);
      const { access_token, expires_in } = response.data;

      if (!access_token) {
        throw new AuthenticationError('No access token received');
      }

      this.accessToken = access_token;
      this.tokenExpiry = Date.now() + (expires_in * 1000);

      return {
        accessToken: access_token,
        expiresIn: expires_in,
        expiresAt: this.tokenExpiry,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }

      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      throw new AuthenticationError(`Login failed: ${message}`, error);
    }
  }

  /**
   * Ensure we have a valid token, login if necessary
   */
  async ensureAuthenticated() {
    if (!this.isTokenValid()) {
      await this.login();
    }
    return this.accessToken;
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(options = {}) {
    const {
      days = parseInt(process.env.DAYS, 10) || DEFAULTS.DAYS,
      pageNumber = 1,
      pageSize = DEFAULTS.PAGE_SIZE,
      keyword = '',
    } = options;

    // Ensure we have valid token
    const token = await this.ensureAuthenticated();

    // Calculate date range
    const timezone = DEFAULTS.TIMEZONE;
    const fromDate = moment().tz(timezone).subtract(days, 'days').format('YYYYMMDD');
    const toDate = moment().tz(timezone).format('YYYYMMDD');

    const data = {
      pageNumber,
      pageSize,
      accountNo: this.accountId,
      currency: DEFAULTS.CURRENCY,
      maxAcentrysrno: '',
      fromDate,
      toDate,
      keyword,
    };

    const headers = this.buildHeaders(token);
    const config = this.buildAxiosConfig(headers);

    try {
      const response = await axios.post(API_ENDPOINTS.TRANSACTIONS, data, config);
      return response.data;
    } catch (error) {
      // Handle token expiration
      if (error.response?.status === 401) {
        this.clear();

        try {
          const newToken = await this.ensureAuthenticated();
          const retryHeaders = this.buildHeaders(newToken);
          const retryConfig = this.buildAxiosConfig(retryHeaders);

          const retryResponse = await axios.post(API_ENDPOINTS.TRANSACTIONS, data, retryConfig);
          return retryResponse.data;
        } catch (retryError) {
          this.clear();
          throw new TokenExpiredError('Token expired and re-login failed');
        }
      }

      const statusCode = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      throw new TPBankError(`Failed to get transactions: ${message}`, statusCode, error);
    }
  }

  /**
   * Clear stored credentials and token
   */
  clear() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }
}

module.exports = TPBankClient;
