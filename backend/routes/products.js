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
  },
  // New Electronics Products
  {
    id: '3',
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical gaming keyboard with blue switches and programmable keys.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg',
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockCount: 45,
    featured: true,
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb', 'electronics']
  },
  {
    id: '4',
    name: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with customizable DPI and RGB lighting.',
    price: 79.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    stockCount: 32,
    featured: false,
    tags: ['gaming', 'mouse', 'wireless', 'rgb', 'electronics']
  },
  {
    id: '5',
    name: '4K Webcam',
    description: 'Ultra HD 4K webcam with auto-focus and noise-canceling microphone for streaming.',
    price: 149.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockCount: 28,
    featured: true,
    tags: ['webcam', '4k', 'streaming', 'microphone', 'electronics']
  },
  {
    id: '6',
    name: 'Portable SSD 1TB',
    description: 'Ultra-fast portable SSD with USB-C connectivity and 1TB storage capacity.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg',
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    stockCount: 67,
    featured: false,
    tags: ['ssd', 'storage', 'portable', 'usb-c', 'electronics']
  },
  {
    id: '7',
    name: 'Wireless Earbuds Pro',
    description: 'Premium wireless earbuds with active noise cancellation and 8-hour battery life.',
    price: 249.99,
    category: 'Electronics',
    image: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg',
    rating: 4.5,
    reviewCount: 445,
    inStock: true,
    stockCount: 89,
    featured: true,
    tags: ['earbuds', 'wireless', 'noise-cancellation', 'bluetooth', 'electronics']
  },
  // Grocery Products
  {
    id: '8',
    name: 'Organic Bananas (2 lbs)',
    description: 'Fresh organic bananas, perfect for snacking or smoothies. Rich in potassium and vitamins.',
    price: 3.99,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    stockCount: 150,
    featured: false,
    tags: ['organic', 'fruit', 'bananas', 'fresh', 'healthy']
  },
  {
    id: '9',
    name: 'Fresh Avocados (4 pack)',
    description: 'Premium Hass avocados, perfectly ripe and ready to eat. Great for toast, salads, and guacamole.',
    price: 7.99,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg',
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockCount: 78,
    featured: true,
    tags: ['avocado', 'fresh', 'healthy', 'organic', 'fruit']
  },
  {
    id: '10',
    name: 'Organic Whole Milk (1 Gallon)',
    description: 'Farm-fresh organic whole milk from grass-fed cows. Rich, creamy, and nutritious.',
    price: 5.49,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg',
    rating: 4.7,
    reviewCount: 167,
    inStock: true,
    stockCount: 45,
    featured: false,
    tags: ['milk', 'organic', 'dairy', 'whole-milk', 'fresh']
  },
  {
    id: '11',
    name: 'Artisan Sourdough Bread',
    description: 'Handcrafted sourdough bread with a crispy crust and soft interior. Baked fresh daily.',
    price: 4.99,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg',
    rating: 4.8,
    reviewCount: 298,
    inStock: true,
    stockCount: 23,
    featured: true,
    tags: ['bread', 'sourdough', 'artisan', 'fresh', 'bakery']
  },
  {
    id: '12',
    name: 'Free-Range Eggs (Dozen)',
    description: 'Farm-fresh free-range eggs from happy hens. Rich in protein and perfect for any meal.',
    price: 6.99,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg',
    rating: 4.5,
    reviewCount: 145,
    inStock: true,
    stockCount: 67,
    featured: false,
    tags: ['eggs', 'free-range', 'protein', 'fresh', 'organic']
  },
  {
    id: '13',
    name: 'Premium Ground Coffee (1 lb)',
    description: 'Single-origin arabica coffee beans, medium roast. Rich flavor with notes of chocolate and caramel.',
    price: 12.99,
    originalPrice: 15.99,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg',
    rating: 4.9,
    reviewCount: 567,
    inStock: true,
    stockCount: 89,
    featured: true,
    tags: ['coffee', 'arabica', 'medium-roast', 'premium', 'single-origin']
  },
  {
    id: '14',
    name: 'Organic Spinach (5 oz)',
    description: 'Fresh organic baby spinach leaves, pre-washed and ready to eat. Perfect for salads and smoothies.',
    price: 3.49,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg',
    rating: 4.4,
    reviewCount: 123,
    inStock: true,
    stockCount: 34,
    featured: false,
    tags: ['spinach', 'organic', 'leafy-greens', 'healthy', 'fresh']
  },
  {
    id: '15',
    name: 'Wild Salmon Fillet (1 lb)',
    description: 'Fresh wild-caught salmon fillet, rich in omega-3 fatty acids. Sustainably sourced.',
    price: 18.99,
    category: 'Groceries',
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    stockCount: 12,
    featured: true,
    tags: ['salmon', 'fish', 'wild-caught', 'omega-3', 'protein']
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