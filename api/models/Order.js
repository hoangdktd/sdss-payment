const Sequelize = require('sequelize');

// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(order) {
  },
};

// naming the table in DB
const tableName = 'order';

// the actual model
const Order = sequelize.define('order', {
  orderId: {
    type: Sequelize.STRING,
    unique: true,
  },
  productId: {
    type: Sequelize.STRING,
  },
  productName: {
    type: Sequelize.STRING,
  },
  eCoinF: {
    type: Sequelize.FLOAT,
  },
  ownerId: {
    type: Sequelize.STRING,
  },
  buyerId: {
    type: Sequelize.STRING,
  },
  orderDate: {
    type: Sequelize.DATE,
  },
  orderStatus: {
    type: Sequelize.STRING,
  }
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Order.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = Order;