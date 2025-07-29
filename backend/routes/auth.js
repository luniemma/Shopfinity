const express = require('express');
const router = express.Router();

// Mock authentication routes for development
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication logic
  if (email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        email: email,
        firstName: 'Demo',
        lastName: 'User',
        role: email.includes('admin') ? 'admin' : 'customer'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
});

router.post('/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (email && password && firstName && lastName) {
    res.json({
      success: true,
      user: {
        id: Date.now().toString(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'customer'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;