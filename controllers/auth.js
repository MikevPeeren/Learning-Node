const User = require('../models/user');

exports.getLogin = (request, response) => {
  response.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (request, response) => {
  // Setting a specific cookie
  // response.setHeader('Set-Cookie', 'loggedIn=true');
  User.findById('5d1f47132cc7995a0b887b9f')
    .then(user => {
      request.session.user = user;
      request.session.isLoggedIn = true;
      response.redirect('/');
    })
    // eslint-disable-next-line no-console
    .catch(error => console.log(error));
};

exports.postLogout = (request, response) => {
  request.session.destroy(() => {
    response.redirect('/');
  });
};
