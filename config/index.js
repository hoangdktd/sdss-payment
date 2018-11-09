const privateRoutes = require('./routes/privateRoutes');
const publicRoutes = require('./routes/publicRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const config = {
  migrate: false,
  privateRoutes,
  publicRoutes,
  rechargeRoutes,
  paymentRoutes,
  port: process.env.PORT || '8080',
};

module.exports = config;
