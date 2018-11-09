const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;
    console.log('userName ========    ' + body.userName);
    console.log('userId ========    ' + body.userId);
    console.log('userType ========    ' + body.userType);
    console.log('eCoin ========    ' + body.eCoin);
    try {
      const checkUser = await User.findOne({
        where: {
          userName: body.userName,
          userId: body.userId,
        },
      });

      if(!checkUser) {
        const user = await User.create({
          userId: body.userId,
          email: body.email,
          userName: body.userName,
          userType: body.userType,
          eCoin: body.eCoin,
        });
        const token = authService().issue({ userId: user.userId });

        return res.status(200).json({  token, user });
      } else {
        return res.status(200).json({  msg: 'duplicate' });
      }
      
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }

    return res.status(400).json({ msg: 'Bad Request: Passwords don\'t match' });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const get = async (req, res) => {
    // params is part of an url
    const { id } = req.params;

    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });

      if(!user) {
        return res.status(400).json({ msg: 'Bad Request: User not found' });
      }

      return res.status(200).json({ user });
    } catch (err) {
      // better save it to log file
      console.error(err);

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };


  return {
    register,
    validate,
    get,
    getAll,
  };
};

module.exports = UserController;
