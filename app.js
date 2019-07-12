// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://MikevPeeren:lvvOzjNXyjsnfRW2@learningnode-6g8uf.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

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

app.use((request, response, next) => {
  if (!request.session.user) {
    return next();
  }
  // eslint-disable-next-line no-underscore-dangle
  User.findById(request.session.user._id)
    .then(user => {
      request.user = user;
      next();
    })
    .catch(() => {});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const newUser = new User({
          username: 'MikevPeeren',
          password: 'rootroot',
          email: 'MikevPeeren@hotmail.com',
          cart: {
            items: []
          }
        });
        newUser.save();
      }
    });

    app.listen(1339);
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
