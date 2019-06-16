// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js');
const sequelize = require('./util/database');
const Product = require('./models/product');
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
  User.findByPk(1)
    .then(user => {
      request.user = user;
      next();
    })
    .catch(() => {});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      User.create({ username: 'MikevPeeren', password: 'root', email: 'MikevPeeren@hotmail.com' });
    }

    return Promise.resolve;
  })
  .then(() => {
    app.listen(1337);
  })
  .catch(() => {});
