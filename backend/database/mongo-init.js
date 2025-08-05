// MongoDB initialization script for Shopfinity eCommerce Platform

// Switch to the shopfinity database
db = db.getSiblingDB('shopfinity');

// Create a user for the application
db.createUser({
  user: 'shopfinity',
  pwd: 'mongo123',
  roles: [
    {
      role: 'readWrite',
      db: 'shopfinity'
    }
  ]
});

// Create collections with validation
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'price', 'category', 'inStock'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Product name is required and must be a string'
        },
        description: {
          bsonType: 'string',
          description: 'Product description is required and must be a string'
        },
        price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Price must be a positive number'
        },
        originalPrice: {
          bsonType: 'number',
          minimum: 0,
          description: 'Original price must be a positive number'
        },
        category: {
          bsonType: 'string',
          description: 'Category is required and must be a string'
        },
        image: {
          bsonType: 'string',
          description: 'Image URL must be a string'
        },
        images: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          },
          description: 'Images must be an array of strings'
        },
        rating: {
          bsonType: 'number',
          minimum: 0,
          maximum: 5,
          description: 'Rating must be between 0 and 5'
        },
        reviewCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'Review count must be a non-negative integer'
        },
        inStock: {
          bsonType: 'bool',
          description: 'In stock status is required and must be boolean'
        },
        stockCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'Stock count must be a non-negative integer'
        },
        featured: {
          bsonType: 'bool',
          description: 'Featured status must be boolean'
        },
        tags: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          },
          description: 'Tags must be an array of strings'
        }
      }
    }
  }
});

db.createCollection('categories', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'slug'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Category name is required and must be a string'
        },
        slug: {
          bsonType: 'string',
          description: 'Category slug is required and must be a string'
        },
        image: {
          bsonType: 'string',
          description: 'Image URL must be a string'
        },
        productCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'Product count must be a non-negative integer'
        }
      }
    }
  }
});

db.createCollection('reviews', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['productId', 'userId', 'userName', 'rating', 'comment'],
      properties: {
        productId: {
          bsonType: 'string',
          description: 'Product ID is required and must be a string'
        },
        userId: {
          bsonType: 'string',
          description: 'User ID is required and must be a string'
        },
        userName: {
          bsonType: 'string',
          description: 'User name is required and must be a string'
        },
        rating: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5,
          description: 'Rating must be between 1 and 5'
        },
        comment: {
          bsonType: 'string',
          description: 'Comment is required and must be a string'
        }
      }
    }
  }
});

// Create indexes for better performance
db.products.createIndex({ "name": "text", "description": "text", "tags": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "rating": -1 });
db.products.createIndex({ "featured": 1 });
db.products.createIndex({ "inStock": 1 });

db.categories.createIndex({ "slug": 1 }, { unique: true });
db.categories.createIndex({ "name": 1 }, { unique: true });

db.reviews.createIndex({ "productId": 1 });
db.reviews.createIndex({ "userId": 1 });
db.reviews.createIndex({ "rating": 1 });

// Insert sample categories
db.categories.insertMany([
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
    productCount: 0
  },
  {
    name: "Groceries",
    slug: "groceries",
    image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
    productCount: 0
  },
  {
    name: "Clothing",
    slug: "clothing",
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    productCount: 0
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg",
    productCount: 0
  },
  {
    name: "Sports",
    slug: "sports",
    image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
    productCount: 0
  },
  {
    name: "Books",
    slug: "books",
    image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
    productCount: 0
  },
  {
    name: "African Traditional Dresses",
    slug: "african-traditional-dresses",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
    productCount: 0
  }
]);

// Insert sample products
db.products.insertMany([
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 99.99,
    originalPrice: 129.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
    images: ["https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg"],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockCount: 25,
    featured: true,
    tags: ["wireless", "bluetooth", "headphones", "audio", "noise-cancellation"]
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
    price: 199.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
    images: ["https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg"],
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    stockCount: 15,
    featured: true,
    tags: ["smartwatch", "fitness", "health", "wearable", "sports"]
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    category: "Clothing",
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    images: ["https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"],
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    stockCount: 50,
    featured: false,
    tags: ["organic", "cotton", "t-shirt", "clothing", "sustainable"]
  },
  {
    name: "Ankara Print Maxi Dress",
    description: "Vibrant handcrafted African maxi dress featuring authentic Ankara print patterns. Made from high-quality cotton wax fabric.",
    price: 89.99,
    category: "African Traditional Dresses",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
    images: ["https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg"],
    rating: 4.8,
    reviewCount: 45,
    inStock: true,
    stockCount: 12,
    featured: true,
    tags: ["ankara", "african", "traditional", "maxi-dress", "handcrafted"]
  },
  // New Electronics Products
  {
    name: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical gaming keyboard with blue switches and programmable keys.",
    price: 129.99,
    originalPrice: 159.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg",
    images: ["https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg"],
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockCount: 45,
    featured: true,
    tags: ["gaming", "keyboard", "mechanical", "rgb", "electronics"]
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with customizable DPI and RGB lighting.",
    price: 79.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg",
    images: ["https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg"],
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    stockCount: 32,
    featured: false,
    tags: ["gaming", "mouse", "wireless", "rgb", "electronics"]
  },
  {
    name: "4K Webcam",
    description: "Ultra HD 4K webcam with auto-focus and noise-canceling microphone for streaming.",
    price: 149.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg",
    images: ["https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg"],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    stockCount: 28,
    featured: true,
    tags: ["webcam", "4k", "streaming", "microphone", "electronics"]
  },
  {
    name: "Portable SSD 1TB",
    description: "Ultra-fast portable SSD with USB-C connectivity and 1TB storage capacity.",
    price: 199.99,
    originalPrice: 249.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg",
    images: ["https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg"],
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    stockCount: 67,
    featured: false,
    tags: ["ssd", "storage", "portable", "usb-c", "electronics"]
  },
  {
    name: "Wireless Earbuds Pro",
    description: "Premium wireless earbuds with active noise cancellation and 8-hour battery life.",
    price: 249.99,
    category: "Electronics",
    image: "https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg",
    images: ["https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg"],
    rating: 4.5,
    reviewCount: 445,
    inStock: true,
    stockCount: 89,
    featured: true,
    tags: ["earbuds", "wireless", "noise-cancellation", "bluetooth", "electronics"]
  },
  // Grocery Products
  {
    name: "Organic Bananas (2 lbs)",
    description: "Fresh organic bananas, perfect for snacking or smoothies. Rich in potassium and vitamins.",
    price: 3.99,
    category: "Groceries",
    image: "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg",
    images: ["https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg"],
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    stockCount: 150,
    featured: false,
    tags: ["organic", "fruit", "bananas", "fresh", "healthy"]
  },
  {
    name: "Fresh Avocados (4 pack)",
    description: "Premium Hass avocados, perfectly ripe and ready to eat. Great for toast, salads, and guacamole.",
    price: 7.99,
    category: "Groceries",
    image: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg",
    images: ["https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg"],
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
    stockCount: 78,
    featured: true,
    tags: ["avocado", "fresh", "healthy", "organic", "fruit"]
  },
  {
    name: "Organic Whole Milk (1 Gallon)",
    description: "Farm-fresh organic whole milk from grass-fed cows. Rich, creamy, and nutritious.",
    price: 5.49,
    category: "Groceries",
    image: "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg",
    images: ["https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg"],
    rating: 4.7,
    reviewCount: 167,
    inStock: true,
    stockCount: 45,
    featured: false,
    tags: ["milk", "organic", "dairy", "whole-milk", "fresh"]
  },
  {
    name: "Artisan Sourdough Bread",
    description: "Handcrafted sourdough bread with a crispy crust and soft interior. Baked fresh daily.",
    price: 4.99,
    category: "Groceries",
    image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
    images: ["https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg"],
    rating: 4.8,
    reviewCount: 298,
    inStock: true,
    stockCount: 23,
    featured: true,
    tags: ["bread", "sourdough", "artisan", "fresh", "bakery"]
  },
  {
    name: "Free-Range Eggs (Dozen)",
    description: "Farm-fresh free-range eggs from happy hens. Rich in protein and perfect for any meal.",
    price: 6.99,
    category: "Groceries",
    image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg",
    images: ["https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg"],
    rating: 4.5,
    reviewCount: 145,
    inStock: true,
    stockCount: 67,
    featured: false,
    tags: ["eggs", "free-range", "protein", "fresh", "organic"]
  },
  {
    name: "Premium Ground Coffee (1 lb)",
    description: "Single-origin arabica coffee beans, medium roast. Rich flavor with notes of chocolate and caramel.",
    price: 12.99,
    originalPrice: 15.99,
    category: "Groceries",
    image: "https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg",
    images: ["https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg"],
    rating: 4.9,
    reviewCount: 567,
    inStock: true,
    stockCount: 89,
    featured: true,
    tags: ["coffee", "arabica", "medium-roast", "premium", "single-origin"]
  },
  {
    name: "Organic Spinach (5 oz)",
    description: "Fresh organic baby spinach leaves, pre-washed and ready to eat. Perfect for salads and smoothies.",
    price: 3.49,
    category: "Groceries",
    image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg",
    images: ["https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg"],
    rating: 4.4,
    reviewCount: 123,
    inStock: true,
    stockCount: 34,
    featured: false,
    tags: ["spinach", "organic", "leafy-greens", "healthy", "fresh"]
  },
  {
    name: "Wild Salmon Fillet (1 lb)",
    description: "Fresh wild-caught salmon fillet, rich in omega-3 fatty acids. Sustainably sourced.",
    price: 18.99,
    category: "Groceries",
    image: "https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg",
    images: ["https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg"],
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    stockCount: 12,
    featured: true,
    tags: ["salmon", "fish", "wild-caught", "omega-3", "protein"]
  }
]);

// Update category product counts
db.categories.updateOne(
  { slug: "electronics" },
  { $set: { productCount: 7 } }
);

db.categories.updateOne(
  { slug: "groceries" },
  { $set: { productCount: 8 } }
);

db.categories.updateOne(
  { slug: "clothing" },
  { $set: { productCount: 1 } }
);

db.categories.updateOne(
  { slug: "african-traditional-dresses" },
  { $set: { productCount: 1 } }
);

// Insert sample reviews
db.reviews.insertMany([
  {
    productId: db.products.findOne({ name: "Wireless Bluetooth Headphones" })._id.toString(),
    userId: "user1",
    userName: "Sarah Johnson",
    rating: 5,
    comment: "Amazing sound quality and battery life exceeds expectations!",
    createdAt: new Date("2024-01-15")
  },
  {
    productId: db.products.findOne({ name: "Wireless Bluetooth Headphones" })._id.toString(),
    userId: "user2",
    userName: "Mike Chen",
    rating: 4,
    comment: "Great headphones, very comfortable for long listening sessions.",
    createdAt: new Date("2024-01-10")
  },
  {
    productId: db.products.findOne({ name: "Ankara Print Maxi Dress" })._id.toString(),
    userId: "user3",
    userName: "Amara Okafor",
    rating: 5,
    comment: "Beautiful dress! The Ankara print is authentic and the quality is excellent.",
    createdAt: new Date("2024-01-20")
  }
]);

print("Shopfinity MongoDB database initialized successfully!");