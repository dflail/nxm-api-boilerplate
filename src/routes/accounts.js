const express = require('express');
const { registration } = require('../controllers/accounts');

const router = express.Router();
router.post('/registration', registration);

module.exports = router;
