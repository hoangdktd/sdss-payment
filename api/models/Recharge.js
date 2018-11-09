const Sequelize = require('sequelize');

// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(recharge) {
  },
};

// naming the table in DB
const tableName = 'recharge';

// the actual model
const Recharge = sequelize.define('recharge', {
  rechargeId: {
    type: Sequelize.STRING,
    unique: true,
  },
  userId: {
    type: Sequelize.STRING,
  },
  amount: {
    type: Sequelize.FLOAT,
  },
  exchangeRate: {
    type: Sequelize.FLOAT,
  },
  paymentDate: {
    type: Sequelize.DATE,
  },
  paymentStatus: {
    type: Sequelize.STRING,
  }
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Recharge.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = Recharge;