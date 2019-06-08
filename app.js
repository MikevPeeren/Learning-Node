// Core Modules
const path = require('path');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');
// const expressHandleBars = require('express-handlebars');

const app = express();

// Handlebars Templating
// ---
// app.engine('handlebars', expressHandleBars({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout'
// }));
// app.set('view engine', 'handlebars');

// PUG Templating
// ---
// app.set('view engine', 'pug');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.exports);
app.use(shopRoutes);

app.use((request, response, next) => {
    response.status(404).render('404', {
        pageTitle: 'Page Not Found!'
    });
});

app.listen(1337);