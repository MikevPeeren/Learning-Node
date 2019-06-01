// Core Node Modules
const http = require('http');

// Third Party Node Modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/add-product', (request, response, next) => {
    response.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Submit</button></form>')
});

app.get('/product', (request, response, next) => {
    console.log(request.body);
    response.redirect('/');
});

app.use('/', (request, response, next) => {
    console.log('In another Middleware!');
    response.send('<h1>Hello from Express</h1>');
});

app.listen(1337);