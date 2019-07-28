// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');

const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://MikevPeeren:lvvOzjNXyjsnfRW2@learningnode-6g8uf.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((request, response, next) => {
  response.locals.isAuthenticated = request.session.isLoggedIn;
  response.locals.csrfToken = request.csrfToken();
  next();
});

app.use((request, response, next) => {
  if (!request.session.user) {
    return next();
  }
  // eslint-disable-next-line no-underscore-dangle
  User.findById(request.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      request.user = user;
      return next();
    })
    .catch(() => {
      return next(new Error('User could not be Found.'));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, request, response, next) => {
  response.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: request.session.isLoggedIn
  });
  response.redirect('/500');
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(1337);
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
