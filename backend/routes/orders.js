const express = require('express');
const router = express.Router();

// Mock orders data
let mockOrders = [];

// Get all orders for a user
router.get('/', (req, res) => {
  const { userId } = req.query;
  
  let filteredOrders = mockOrders;
  if (userId) {
    filteredOrders = mockOrders.filter(order => order.userId === userId);
  }
  
  res.json({
    success: true,
    orders: filteredOrders
  });
});

// Get single order
router.get('/:id', (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  
  if (order) {
    res.json({
      success: true,
      order: order
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
});

// Create new order
router.post('/', (req, res) => {
  const newOrder = {
    id: `ORD-${Date.now()}`,
    orderNumber: `ORD-${Date.now()}`,
    ...req.body,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockOrders.push(newOrder);
  
  res.status(201).json({
    success: true,
    order: newOrder
  });
});

// Update order status
router.put('/:id', (req, res) => {
  const orderIndex = mockOrders.findIndex(o => o.id === req.params.id);
  
  if (orderIndex !== -1) {
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      order: mockOrders[orderIndex]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
});

// Cancel order
router.delete('/:id', (req, res) => {
  const orderIndex = mockOrders.findIndex(o => o.id === req.params.id);
  
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = 'cancelled';
    mockOrders[orderIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: mockOrders[orderIndex]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }
});

module.exports = router;