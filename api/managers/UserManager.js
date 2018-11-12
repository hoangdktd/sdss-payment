const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

module.exports = {
    get: async (param, callback) => {
        try {
            const user = await User.findOne({
                where: {
                    userId: param.userId,
                },
            });

            if(!user) {
                return callback(400, 'Bad Request: User not found', 400, null);
            }

            return callback(null,null,200, user);
        } catch (err) {
            // better save it to log file
            return callback(500, 'Internal server error', 500, null);
        }
    },

  getAll: async (params, callback) => {
    try {
      const users = await User.findAll();
      return callback(null,null,200, users);
    //   return res.status(200).json({ users });
    } catch (err) {
      return callback(500, 'Internal server error', 500, null);
    //   return res.status(500).json({ msg: 'Internal server error' });
    }
  }
};
