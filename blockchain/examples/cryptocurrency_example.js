const cryptocurrency = new Cryptocurrency('MyCoin', 'MYC', 1000000, 100, 2)

// Add transactions to pending transactions
cryptocurrency.createTransaction(new Transaction('address1', 'address2', 50))
cryptocurrency.createTransaction(new Transaction('address2', 'address1', 25))

// Mine pending transactions
cryptocurrency.minePendingTransactions(
  '0x0000000000000000000000000000000000000000'
)

// Check balance of address1
console.log(cryptocurrency.getBalanceOfAddress('address1')) // 75

// Check balance of address2
console.log(cryptocurrency.getBalanceOfAddress('address2')) // 125

// Check if blockchain is valid
console.log(cryptocurrency.isChainValid()) // true
