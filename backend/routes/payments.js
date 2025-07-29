const express = require('express');
const router = express.Router();

// Mock payment processing
router.post('/process', (req, res) => {
  const { amount, currency = 'USD', paymentMethod } = req.body;
  
  // Simulate payment processing delay
  setTimeout(() => {
    // Mock successful payment
    const paymentResult = {
      id: `pay_${Date.now()}`,
      amount: amount,
      currency: currency,
      status: 'succeeded',
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      payment: paymentResult
    });
  }, 1000);
});

// Create payment intent (Stripe-like)
router.post('/create-intent', (req, res) => {
  const { amount, currency = 'USD' } = req.body;
  
  const paymentIntent = {
    id: `pi_${Date.now()}`,
    amount: amount,
    currency: currency,
    status: 'requires_payment_method',
    clientSecret: `pi_${Date.now()}_secret_mock`,
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    paymentIntent: paymentIntent
  });
});

// Confirm payment
router.post('/confirm/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock payment confirmation
  const confirmedPayment = {
    id: id,
    status: 'succeeded',
    confirmedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    payment: confirmedPayment
  });
});

// Refund payment
router.post('/refund/:id', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  
  const refund = {
    id: `re_${Date.now()}`,
    paymentId: id,
    amount: amount,
    status: 'succeeded',
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    refund: refund
  });
});

module.exports = router;