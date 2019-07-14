const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (request, response) => {
  response.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (request, response) => {
  response.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (request, response) => {
  const { email, password } = request.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        response.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            request.session.user = user;
            request.session.isLoggedIn = true;
            return request.session.save(() => {
              response.redirect('/');
            });
          }
          response.redirect('/login');
        })
        .catch(() => {
          response.redirect('/login');
        });
    })
    // eslint-disable-next-line no-console
    .catch(error => console.log(error));
};

exports.postLogout = (request, response) => {
  request.session.destroy(() => {
    response.redirect('/');
  });
};

exports.postSignup = (request, response) => {
  const { username, email, password } = request.body;
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        return response.redirect('/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            username,
            email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(() => {
          response.redirect('/login');
        });
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postLogout = (request, response) => {
  request.session.destroy(() => {
    response.redirect('/');
  });
};
