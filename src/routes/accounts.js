const express = require('express');
const { registration, login, logout } = require('../controllers/accounts');
const protect = require('../middleware/auth-handler');

const router = express.Router();
router.get('/logout', protect, logout);
router.post('/registration', registration);
router.post('/login', login);

module.exports = router;
