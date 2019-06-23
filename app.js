// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const { mongoConnect } = require('./util/database');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use((request, response, next) => {
  User.findUserById('5d0e35421c9d4400003823f3')
    .then(user => {
      request.user = new User(user.username, user.password, user.email, user.cart, user._id);
      next();
    })
    .catch(() => {});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(1337);
});
