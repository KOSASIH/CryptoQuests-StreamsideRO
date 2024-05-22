const axios = require('axios')
const StellarSdk = require('stellar-sdk')

// Set up Pi Network API client
const piTestnet = new StellarSdk.Server('https://api.testnet.minepi.com')

// Set up axios client for making API requests
const axiosClient = axios.create({
  baseURL: 'https://api.streamside-ro.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Set up Stellar SDK
const myPublicKey = 'G_YOUR_PUBLIC_KEY'
let myAccount
let baseFee

piTestnet.loadAccount(myPublicKey).then((response) => {
  myAccount = response
})

piTestnet.fetchBaseFee().then((response) => {
  baseFee = response
})

// Function to create a payment operation
function createPaymentOperation (recipientAddress, amount) {
  return new StellarSdk.Operation.payment({
    destination: recipientAddress,
    asset: StellarSdk.Asset.native(),
    amount: amount.toString()
  })
}

// Function to build a transaction
function buildTransaction (payment) {
  const timebounds = piTestnet.fetchTimebounds(180)

  const transaction = new StellarSdk.TransactionBuilder(myAccount, {
    fee: baseFee,
    networkPassphrase: 'Pi Testnet',
    timebounds
  })
    .addOperation(payment)
    .addMemo(StellarSdk.Memo.text('payment identifier'))
    .build()

  return transaction
}

// Function to sign a transaction
function signTransaction (transaction) {
  const mySecretSeed = 'S_YOUR_SECRET_SEED'
  const myKeypair = StellarSdk.Keypair.fromSecret(mySecretSeed)

  transaction.sign(myKeypair)

  return transaction
}

// Function to submit a transaction to the Pi blockchain
function submitTransaction (transaction) {
  return piTestnet.submitTransaction(transaction)
}

// Function to complete a payment by sending an API request to the /complete endpoint
function completePayment (paymentIdentifier, txid) {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = {
    identifier: paymentIdentifier,
    recipient: 'G_RECIPIENT_ADDRESS',
    metadata: { test: 'your metadata' },
    uid: 'userUid'
  }

  return axiosClient.post(
    `/v2/payments/${paymentIdentifier}/complete`,
    { txid },
    config
  )
}

// Function to initiate a payment
async function initiatePayment (amount) {
  const recipientAddress = 'G_RECIPIENT_ADDRESS'

  // Create a payment operation
  const payment = createPaymentOperation(recipientAddress, amount)

  // Build a transaction
  const transaction = buildTransaction(payment)

  // Sign the transaction
  const signedTransaction = signTransaction(transaction)

  // Submit the transaction to the Pi blockchain
  const txid = await submitTransaction(signedTransaction)

  // Complete the payment by sending an API request to the /complete endpoint
  const completeResponse = await completePayment('paymentIdentifier', txid)

  return completeResponse
}

module.exports = {
  initiatePayment
}
