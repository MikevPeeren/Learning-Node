const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid Email.')
      .normalizeEmail(),
    body('password', 'Please enter a password that is atleast 5 characters')
      .isLength({ min: 4 })
      .trim()
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email.')
      .custom(async value => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject('This email address exists already.');
        }
      })
      .normalizeEmail(),
    body('password', 'Please enter a password that is atleast 5 characters')
      .isLength({ min: 4 })
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { request }) => {
        if (value !== request.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.post('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
