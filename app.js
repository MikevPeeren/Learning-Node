// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

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
  User.findById('5d1d0077e67f2926eeb4a0e3')
    .then(user => {
      request.user = user;
      next();
    })
    .catch(() => {});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://MikevPeeren:lvvOzjNXyjsnfRW2@learningnode-6g8uf.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
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

    app.listen(1337);
  })
  .catch(() => {});
