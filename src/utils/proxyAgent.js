const { HttpsProxyAgent } = require('https-proxy-agent');

/**
 * Creates an HTTPS proxy agent from config object
 * @param {Object} proxyConfig - Proxy configuration
 * @param {string} proxyConfig.schema - Protocol schema (e.g. 'http', 'https')
 * @param {string} proxyConfig.host - Proxy host/IP
 * @param {number} proxyConfig.port - Proxy port
 * @param {string} [proxyConfig.username] - Proxy username (optional)
 * @param {string} [proxyConfig.password] - Proxy password (optional)
 * @returns {HttpsProxyAgent|null} Proxy agent or null if config is invalid
 */
function createProxyAgent(proxyConfig) {
  if (!proxyConfig || !proxyConfig.schema || !proxyConfig.host || !proxyConfig.port) {
    return null;
  }

  const { schema, host, port, username, password } = proxyConfig;

  // Build proxy URL
  const hasAuth = username && password;
  const proxyUrl = hasAuth
    ? `${schema}://${username}:${password}@${host}:${port}`
    : `${schema}://${host}:${port}`;

  try {
    return new HttpsProxyAgent(proxyUrl);
  } catch (error) {
    console.error('Failed to create proxy agent:', error.message);
    return null;
  }
}

module.exports = { createProxyAgent };
