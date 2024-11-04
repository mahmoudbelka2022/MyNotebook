const User = require('../models/User');

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    req.session.error = 'Please login to access this page';
    return res.redirect('/auth/login');
  }
  next();
};

const isGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/notes/dashboard');
  }
  next();
};

const setUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      res.locals.user = user;
    } catch (err) {
      console.error('Error setting user:', err);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = {
  isAuthenticated,
  isGuest,
  setUser
};
