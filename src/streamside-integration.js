const axios = require('axios');
const PiIntegration = require('./pi-integration');

// Set up axios client for making API requests
const axiosClient = axios.create({
  baseURL: 'https://api.streamside-ro.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create a payment request
function createPaymentRequest(amount) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = {
    amount: amount.toString(),
    currency: 'PI',
    metadata: { test: 'your metadata' },
    uid: 'userUid',
  };

  return axiosClient.post('/v2/payments', body, config);
}

// Function to complete a payment by sending an API request to the /complete endpoint
function completePayment(paymentIdentifier, txid) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = {
    identifier: paymentIdentifier,
    recipient: 'G_RECIPIENT_ADDRESS',
    metadata: { test: 'your metadata' },
    uid: 'userUid',
  };

  return axiosClient.post(`/v2/payments/${paymentIdentifier}/complete`, { txid }, config);
}

// Function to initiate a payment
async function initiatePayment(amount) {
  // Create a payment request
  const paymentRequest = await createPaymentRequest(amount);

  // Initiate a payment using Pi Network integration
  const piIntegration = new PiIntegration();
  const completeResponse = await piIntegration.initiatePayment(amount);

  // Complete the payment by sending an API request to the /complete endpoint
  const completePaymentResponse = await completePayment(paymentRequest.data.identifier, completeResponse.data.txid);

  return completePaymentResponse;
}

module.exports = {
  initiatePayment,
};
