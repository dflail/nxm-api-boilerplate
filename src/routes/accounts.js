const express = require('express');
const {
  current,
  login,
  logout,
  forgotPassword,
  registration,
  resetPassword
} = require('../controllers/accounts');
const protect = require('../middleware/auth-handler');

const router = express.Router();
router.get('/current', protect, current);
router.get('/logout', protect, logout);
router.post('/registration', registration);
router.post('/login', login);
router.post('/password', forgotPassword);
router.put('/password/:token', resetPassword);

module.exports = router;
