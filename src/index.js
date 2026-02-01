require('dotenv').config();

const { createApp } = require('./app');
const { DEFAULTS } = require('./config/constants');

const PORT = process.env.PORT || DEFAULTS.PORT;
const app = createApp();

app.listen(PORT, () => {
  console.log(`TPBank API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
