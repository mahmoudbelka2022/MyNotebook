const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');
const { isAuthenticated, isGuest, setUser } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://vercel-admin-user:37gL9NDemNr08Ikg@cluster0.albqgvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ttl: 24 * 60 * 60 // Session TTL (1 day)
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Set user middleware
app.use(setUser);

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  delete req.session.success;
  delete req.session.error;
  next();
});

// Routes
app.get('/', isGuest, (req, res) => {
  res.redirect('/auth/login');
});

app.use('/auth', require('./routes/auth'));
app.use('/notes', isAuthenticated, require('./routes/notes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Error template
app.get('/error', (req, res) => {
  res.render('error', {
    message: 'Something went wrong!',
    error: {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
