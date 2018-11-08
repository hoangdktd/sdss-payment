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
    const user = await User.create({
        userId: body.userId,
        email: body.email,
        userName: body.userName,
        userType: body.userType,
        eCoin: body.eCoin,
    });
    const token = authService().issue({ userId: user.userId });

    return res.status(200).json({  token, user });
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
    getAll,
  };
};

module.exports = UserController;
