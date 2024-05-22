const Transaction = require('../models/transaction');
const { createTransaction } = require('../integration/streamside-integration');
const { createTransaction as createPiTransaction } = require('../integration/pi-integration');

const createTransactionController = async (req, res) => {
  const { playerId, amount } = req.body;

  // Verify that the playerId and amount are provided
  if (!playerId || !amount) {
    return res.status(400).json({
      message: 'PlayerId and amount are required',
    });
  }

  // Create a new transaction in Streamside Ragnarok Online
  const streamsideTransaction = await createTransaction(playerId, amount);

  // Create a new transaction in the local database
  const newTransaction = await Transaction.create({
    playerId,
    amount,
  });

  // Create a new transaction in Pi Network
  const piTransaction = await createPiTransaction(streamsideTransaction.recipient, amount);

  // Update the local transaction with the Pi Network transaction hash
  await Transaction.update(
    {
      piHash: piTransaction.hash,
    },
    {
      where: {
        id: newTransaction.id,
      },
    }
  );

  // Return the new transaction
  res.status(201).json(newTransaction);
};

module.exports = {
  createTransactionController,
};
