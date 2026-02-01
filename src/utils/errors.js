/**
 * Custom error classes for better error handling
 */

class TPBankError extends Error {
  constructor(message, statusCode = 500, originalError = null) {
    super(message);
    this.name = 'TPBankError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

class AuthenticationError extends TPBankError {
  constructor(message = 'Authentication failed', originalError = null) {
    super(message, 401, originalError);
    this.name = 'AuthenticationError';
  }
}

class ValidationError extends TPBankError {
  constructor(message = 'Validation failed', fields = []) {
    super(message, 400);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

class TokenExpiredError extends TPBankError {
  constructor(message = 'Token expired') {
    super(message, 401);
    this.name = 'TokenExpiredError';
  }
}

module.exports = {
  TPBankError,
  AuthenticationError,
  ValidationError,
  TokenExpiredError,
};
