const express = require('express');
const router = express.Router();

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 99.99,
    originalPrice: 129.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockCount: 25,
    featured: true,
    tags: ['wireless', 'bluetooth', 'headphones', 'audio', 'noise-cancellation']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    stockCount: 15,
    featured: true,
    tags: ['smartwatch', 'fitness', 'health', 'wearable', 'sports']
  }
];

// Get all products
router.get('/', (req, res) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;
  let filteredProducts = [...mockProducts];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Filter by search
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Sort products
  if (sort) {
    switch (sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  res.json({
    success: true,
    products: filteredProducts,
    total: filteredProducts.length
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  
  if (product) {
    res.json({
      success: true,
      product: product
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
});

// Create product (admin only)
router.post('/', (req, res) => {
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  mockProducts.push(newProduct);
  
  res.status(201).json({
    success: true,
    product: newProduct
  });
});

// Update product (admin only)
router.put('/:id', (req, res) => {
  const productIndex = mockProducts.findIndex(p => p.id === req.params.id);
  
  if (productIndex !== -1) {
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      product: mockProducts[productIndex]
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
});

// Delete product (admin only)
router.delete('/:id', (req, res) => {
  const productIndex = mockProducts.findIndex(p => p.id === req.params.id);
  
  if (productIndex !== -1) {
    mockProducts.splice(productIndex, 1);
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
});

module.exports = router;