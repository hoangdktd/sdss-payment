const Sequelize = require('sequelize');

// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  // beforeCreate(user) {
  //   // user.password = bcryptSevice.password(user);
  // },
};

// naming the table in DB
const tableName = 'users';

// the actual model
const User = sequelize.define('User', {
  userId: {
    type: Sequelize.STRING,
    unique: true,
  },
  userName: {
    type: Sequelize.STRING,
    unique: true,
  },
  userType: {
    type: Sequelize.STRING,
  },
  eCoin: {
    type: Sequelize.INTEGER,
  },
  email: {
    type: Sequelize.STRING,
  },
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  // delete values.password;

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = User;