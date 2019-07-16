/* eslint-disable prefer-destructuring */
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: 'SG.KA_m4BrDR-mAVrSCAxBs2A.AIiKwtiEhswaQts11O44rd_rjY01pnK6cdzuVum4Y'
    }
  })
);

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
          return transporter
            .sendMail({
              to: email,
              from: 'mikevpeeren@hotmail.com',
              subject: 'Signup Succeeded!',
              html: '<h1>You successfully signed up!</h1>'
            })
            .then(
              transporter.sendMail({
                to: 'mikevpeeren@hotmail.com',
                from: 'NodeApp@hotmail.com',
                subject: 'A Signup Has Been Done.',
                html: email
              })
            )
            .catch(() => {});
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

exports.getReset = (request, response) => {
  let message = request.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  response.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (request, response, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      return response.render('/reset');
    }

    const token = buffer.toString('hex');
    User.findOne({ email: request.body.email })
      .then(user => {
        if (!user) {
          request.flash('error', 'No account with that Email found.');
          return response.render('/reset');
        }
        // eslint-disable-next-line no-param-reassign
        user.resetToken = token;
        // eslint-disable-next-line no-param-reassign
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        response.redirect('/');
        transporter.sendMail({
          to: request.body.email,
          from: 'NodeApp@hotmail.com',
          subject: 'Password Reset',
          html: `
            <p>You requested a Password Reset.</p>
            <p>Click this <a href="http://localhost:1337/reset/${token}"> URL </a> to set a new password.</p>
          `
        });
      })
      .catch(() => {});
  });
};

exports.getNewPassword = (request, response) => {
  const token = request.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then(user => {
    let message = request.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    response.render('auth/new-password', {
      // eslint-disable-next-line no-underscore-dangle
      userID: user._id.toString(),
      passwordToken: token,
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message
    });
  });
};

exports.postNewPassword = (request, response) => {
  const newPassword = request.body.password;
  const userID = request.body.userID;
  const passwordToken = request.body.passwordToken;

  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userID
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;

      return resetUser.save();
    })
    .then(() => {
      response.redirect('/login');
    });
};
