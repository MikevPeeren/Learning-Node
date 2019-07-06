exports.getLogin = (request, response) => {
  response.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};
