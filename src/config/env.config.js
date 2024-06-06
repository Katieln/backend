const dotenv = require('dotenv');
const path = require('path');

const environment = process.env.NODE_ENV || 'DEVELOPMENT';

dotenv.config({
  path: environment === 'DEVELOPMENT' ? path.resolve(__dirname, '.env') : path.resolve(__dirname, '.env.production')
});
