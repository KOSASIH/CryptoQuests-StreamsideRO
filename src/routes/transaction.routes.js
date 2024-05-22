const express = require('express');
const transactionController = require('../controllers/transaction.controller');

const router = express.Router();

router.post('/', transactionController.createTransactionController);

module.exports = router;
