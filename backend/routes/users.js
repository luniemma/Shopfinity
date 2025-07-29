const express = require('express');
const router = express.Router();

// Mock users data
const mockUsers = [
  {
    id: '1',
    email: 'admin@shopfinity.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'customer@shopfinity.com',
    firstName: 'John',
    lastName: 'Customer',
    role: 'customer',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Get all users (admin only)
router.get('/', (req, res) => {
  res.json({
    success: true,
    users: mockUsers
  });
});

// Get single user
router.get('/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  
  if (user) {
    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

// Update user profile
router.put('/:id', (req, res) => {
  const userIndex = mockUsers.findIndex(u => u.id === req.params.id);
  
  if (userIndex !== -1) {
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = mockUsers[userIndex];
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', (req, res) => {
  const userIndex = mockUsers.findIndex(u => u.id === req.params.id);
  
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

module.exports = router;