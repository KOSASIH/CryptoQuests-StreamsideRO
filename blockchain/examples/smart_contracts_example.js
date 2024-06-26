const cryptocurrency = new Cryptocurrency('MyCoin', 'MYC', 1000000, 100, 2)

// Define smart contract code
const contractCode = `
  function add(a, b) {
    return a + b;
  }
`

// Create smart contract
const contract = new SmartContract(cryptocurrency, contractCode)

// Execute contract with inputs
const output = contract.executeContract([10, 20])
console.log(output) // 30

// Add transaction to blockchain
const transaction = new Transaction(null, contract.contractAddress, 100)
contract.addTransactionToBlockchain(transaction)

// Check contract storage
console.log(contract.getContractStorage()) // {}

// Update contract storage
contract.contractStorage.myVar = 50

// Check contract storage
console.log(contract.getContractStorage()) // { myVar: 50 }
