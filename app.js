// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error.js')
const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

db.execute('Select * from products')
    .then(result => {
        console.log(result[0]);
    }).catch(error => {
        console.log(error);
    });

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(1337);