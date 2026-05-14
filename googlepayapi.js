

const paymentsClient = new google.payments.api.PaymentsClient({
  environment: 'TEST',  // → 'PRODUCTION' when live

  // Optional: merchant info for payment sheet
  merchantInfo: {
    merchantName: 'Your Store Name',
    merchantId:   'YOUR_MERCHANT_ID'  // from Google Pay Console
  },

  // Optional: callback for shipping/offer updates
  paymentDataCallbacks: {
    onPaymentAuthorized: onPaymentAuthorized
  }
});

const paymentsClient = new google.payments.api.PaymentsClient({
  environment: 'TEST',  // → 'PRODUCTION' when live

  // Optional: merchant info for payment sheet
  merchantInfo: {
    merchantName: 'Your Store Name',
    merchantId:   'YOUR_MERCHANT_ID'  // from Google Pay Console
  },

  // Optional: callback for shipping/offer updates
  paymentDataCallbacks: {
    onPaymentAuthorized: onPaymentAuthorized
  }
});

// Check if Google Pay is available for this user/device
async function initGooglePay() {
  const isReady = await paymentsClient
    .isReadyToPay({ allowedPaymentMethods })
    .then(res => res.result);

  if (isReady) {
    addGooglePayButton();  // Proceed to Step 4
  }
}

const tokenizationSpec = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    // For Stripe:
    gateway:          'stripe',
    'stripe:version': '2020-08-27',
    'stripe:publishableKey': 'pk_test_...'

    // For Braintree, replace with:
    // gateway: 'braintree',
    // 'braintree:apiVersion': 'v1',
    // 'braintree:sdkVersion': braintree.client.VERSION,
    // 'braintree:merchantId': 'YOUR_MERCHANT_ID',
    // 'braintree:clientKey': 'sandbox_...'
  }
};

const allowedPaymentMethods = [{
  type: 'CARD',
  parameters: {
    allowedAuthMethods:  ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    allowedCardNetworks: ['AMEX', 'DISCOVER', 'VISA', 'MASTERCARD'],
  },
  tokenizationSpecification: tokenizationSpec
}];

function addGooglePayButton() {
  const button = paymentsClient.createButton({
    onClick:     onGooglePayButtonClicked,
    buttonType:  'buy',      // 'pay' | 'book' | 'checkout' | 'donate' | 'order' | 'subscribe' | 'plain'
    buttonColor: 'default', // 'black' | 'white'
    buttonSizeMode: 'fill'   // fills parent container width
  });

  document.getElementById('google-pay-button-container')
    .appendChild(button);
}
isReadyToPay()
Check device/browser support
→
createButton

const paymentDataRequest = {
  apiVersion:      2,
  apiVersionMinor: 0,
  allowedPaymentMethods,
  merchantInfo: {
    merchantId:   'YOUR_MERCHANT_ID',
    merchantName: 'Your Store Name'
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPrice:       '49.99',
    currencyCode:     'USD',
    countryCode:      'US'
  }
};

async function onGooglePayButtonClicked() {
  try {
    // Opens the Google Pay payment sheet
    const paymentData = await
      paymentsClient.loadPaymentData(paymentDataRequest);

    // Extract the encrypted token
    const token = paymentData
      .paymentMethodData.tokenizationData.token;

    // 🔒 Send token to YOUR backend for final charge
    const result = await fetch('/api/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, amount: 4999 })
    });

    const { success } = await result.json();
    if (success) showSuccess();

  } catch (err) {
    // User dismissed sheet or payment failed
    console.error('Payment failed:', err.statusCode, err.statusMessage);
  }
}