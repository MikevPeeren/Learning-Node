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
  request.session.isLoggedIn = true;
  response.redirect('/');
};
