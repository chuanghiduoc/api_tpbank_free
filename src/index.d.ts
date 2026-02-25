export interface ProxyConfig {
  schema: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
}

export interface TPBankCredentials {
  username: string;
  password: string;
  deviceId: string;
  accountId: string;
  proxy?: ProxyConfig;
}

export interface TransactionHistoryOptions {
  days?: number;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
}

export interface LoginResult {
  accessToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface TransactionEntry {
  id: string;
  arrangementId: string;
  reference: string;
  description: string;
  bookingDate: string;
  valueDate: string;
  amount: string;
  currency: string;
  creditDebitIndicator: string;
  runningBalance: string;
}

export declare class TPBankClient {
  constructor(credentials: TPBankCredentials);

  username: string;
  password: string;
  deviceId: string;
  accountId: string;
  accessToken: string | null;
  tokenExpiry: number | null;

  isTokenValid(): boolean;
  login(): Promise<LoginResult>;
  ensureAuthenticated(): Promise<string>;
  getTransactionHistory(options?: TransactionHistoryOptions): Promise<TransactionEntry[]>;
  clear(): void;
}

export declare class TPBankError extends Error {
  name: string;
  statusCode: number;
  originalError: Error | null;
  constructor(message: string, statusCode?: number, originalError?: Error | null);
}

export declare class AuthenticationError extends TPBankError {
  constructor(message?: string, originalError?: Error | null);
}

export declare class TokenExpiredError extends TPBankError {
  constructor(message?: string);
}

export declare const DEFAULTS: {
  DAYS: number;
  PAGE_SIZE: number;
  CURRENCY: string;
  TIMEZONE: string;
  TOKEN_REFRESH_BUFFER_SECONDS: number;
};
