const { HttpsProxyAgent } = require('https-proxy-agent');

/**
 * Creates an HTTPS proxy agent from environment variables
 * @returns {HttpsProxyAgent|null} Proxy agent or null if not configured
 */
function createProxyAgent() {
  const { PROXY_SCHEMA, PROXY_IP, PROXY_PORT, PROXY_USERNAME, PROXY_PASSWORD } = process.env;

  // Check required proxy config
  if (!PROXY_SCHEMA || !PROXY_IP || !PROXY_PORT) {
    return null;
  }

  // Build proxy URL
  const hasAuth = PROXY_USERNAME && PROXY_PASSWORD;
  const proxyUrl = hasAuth
    ? `${PROXY_SCHEMA}://${PROXY_USERNAME}:${PROXY_PASSWORD}@${PROXY_IP}:${PROXY_PORT}`
    : `${PROXY_SCHEMA}://${PROXY_IP}:${PROXY_PORT}`;

  try {
    return new HttpsProxyAgent(proxyUrl);
  } catch (error) {
    console.error('Failed to create proxy agent:', error.message);
    return null;
  }
}

module.exports = { createProxyAgent };
