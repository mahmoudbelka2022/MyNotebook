const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    res.status(400).send('Registration failed');
  }
});

router.get('/login', (req, res) => {
  if(req.session.userId){
    return res.redirect('/notes/dashboard');
  }
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid credentials');
    }

    req.session.userId = user._id;
    res.redirect('/notes/dashboard');
  } catch (err) {
    res.status(400).send('Login failed');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;
