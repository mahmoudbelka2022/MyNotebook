const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
//const { isAuthenticated } = require('../middleware/auth'); // Make sure this path is correct

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/auth/login');
}
// Get dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.session.userId }).sort({ createdAt: -1 });
    res.render('dashboard', { notes });
  } catch (err) {
    req.session.error = 'Error loading notes';
    res.redirect('/');
  }
});



// Create note
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    await Note.create({
      user: req.session.userId,
      title,
      content
    });
    req.session.success = 'Note created successfully';
    res.redirect('/notes/dashboard');
  } catch (err) {
    req.session.error = 'Error creating note';
    res.redirect('/notes/dashboard');
  }
});

// Get edit page
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      req.session.error = 'Note not found';
      return res.redirect('/notes/dashboard');
    }
    res.render('edit', { note });
  } catch (err) {
    req.session.error = 'Error loading note';
    res.redirect('/notes/dashboard');
  }
});

// Update note
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { title, content },
      { new: true }
    );
    if (!note) {
      req.session.error = 'Note not found';
      return res.redirect('/notes/dashboard');
    }
    req.session.success = 'Note updated successfully';
    res.redirect('/notes/dashboard');
  } catch (err) {
    req.session.error = 'Error updating note';
    res.redirect('/notes/dashboard');
  }
});



// Delete note
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      req.session.error = 'Note not found';
      return res.redirect('/notes/dashboard');
    }
    req.session.success = 'Note deleted successfully';
    res.redirect('/notes/dashboard');
  } catch (err) {
    req.session.error = 'Error deleting note';
    res.redirect('/notes/dashboard');
  }
});

module.exports = router;
