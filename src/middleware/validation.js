/**
 * Validate required credentials for API requests
 */
function validateCredentials(req, res, next) {
  // Note: Use TPBANK_USERNAME to avoid conflict with Windows USERNAME env var
  const username = req.body.username || process.env.TPBANK_USERNAME;
  const password = req.body.password || process.env.TPBANK_PASSWORD;
  const deviceId = req.body.deviceId || process.env.DEVICE_ID;
  const accountId = req.body.accountId || process.env.ACCOUNT_ID;

  const missingFields = [];

  if (!username) missingFields.push('username');
  if (!password) missingFields.push('password');
  if (!deviceId) missingFields.push('deviceId');
  if (!accountId) missingFields.push('accountId');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required parameters',
      message: `Thiếu tham số bắt buộc: ${missingFields.join(', ')}`,
      fields: missingFields,
    });
  }

  // Attach validated credentials to request
  req.credentials = {
    username,
    password,
    deviceId,
    accountId,
  };

  next();
}

module.exports = { validateCredentials };
