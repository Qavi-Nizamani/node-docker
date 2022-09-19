const User = require('../models/userModel');

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    req.session.user = newUser;
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || user.password !== password) throw new Error('Wrong username or password!');

    req.session.user = user;
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
    });
  }
};
