
const express = require('express');
const router = express.Router();
const {
  getCurrency
} = require('../controllers/currency.controller');

router.get('/', getCurrency);

module.exports = router;
