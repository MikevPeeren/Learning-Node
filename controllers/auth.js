const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (request, response) => {
  let message = request.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  response.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (request, response) => {
  let message = request.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  response.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (request, response) => {
  const { email, password } = request.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        request.flash('error', 'Invalid Email or Password');
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
          request.flash('error', 'Invalid Email or Password');
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
        request.flash('error', 'Email already exists');
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
