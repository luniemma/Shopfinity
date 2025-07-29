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
  }
]);

// Update category product counts
db.categories.updateOne(
  { slug: "electronics" },
  { $set: { productCount: 2 } }
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