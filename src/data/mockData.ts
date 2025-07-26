import { Product, Category, User, Review } from '../types';

export const mockOrders = [
  {
    id: 'order-1',
    userId: '2',
    items: [
      {
        id: 'item-1',
        productId: '1',
        product: products[0],
        quantity: 1
      }
    ],
    total: 199.99,
    subtotal: 199.99,
    tax: 16.00,
    shipping: 0,
    status: 'delivered' as const,
    paymentStatus: 'completed' as const,
    trackingNumber: 'TRK123456789',
    shippingAddress: {
      name: 'John Customer',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    billingAddress: {
      name: 'John Customer',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    paymentMethod: 'card',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  },
  {
    id: 'order-2',
    userId: '2',
    items: [
      {
        id: 'item-2',
        productId: '2',
        product: products[1],
        quantity: 1
      }
    ],
    total: 299.99,
    subtotal: 299.99,
    tax: 24.00,
    shipping: 9.99,
    status: 'processing' as const,
    paymentStatus: 'completed' as const,
    shippingAddress: {
      name: 'John Customer',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    billingAddress: {
      name: 'John Customer',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    paymentMethod: 'card',
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-20T15:45:00Z'
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    productCount: 15
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    productCount: 28
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    productCount: 12
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    productCount: 9
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'electronics',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 45,
    featured: true,
    tags: ['bluetooth', 'wireless', 'noise-cancellation']
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life. Track your health and fitness goals.',
    price: 299.99,
    category: 'electronics',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    stockCount: 23,
    featured: true,
    tags: ['fitness', 'smartwatch', 'health']
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, comfortable 100% organic cotton t-shirt. Available in multiple colors and sizes.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'clothing',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    stockCount: 156,
    featured: false,
    tags: ['cotton', 'organic', 'comfortable']
  },
  {
    id: '4',
    name: 'Modern Table Lamp',
    description: 'Elegant LED table lamp with adjustable brightness and wireless charging base. Perfect for any modern workspace.',
    price: 89.99,
    category: 'home-garden',
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.7,
    reviewCount: 34,
    inStock: true,
    stockCount: 28,
    featured: true,
    tags: ['led', 'modern', 'wireless-charging']
  },
  {
    id: '5',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper. Designed for performance and comfort.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'sports',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    stockCount: 67,
    featured: true,
    tags: ['running', 'lightweight', 'breathable']
  },
  {
    id: '6',
    name: 'Smartphone 128GB',
    description: 'Latest smartphone with 128GB storage, triple camera system, and all-day battery life.',
    price: 699.99,
    category: 'electronics',
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.9,
    reviewCount: 234,
    inStock: true,
    stockCount: 12,
    featured: true,
    tags: ['smartphone', '128gb', 'triple-camera']
  }
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing sound quality and the noise cancellation is fantastic!',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    productId: '1',
    userId: '2',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Great headphones, battery life is as advertised. Very comfortable.',
    createdAt: '2024-01-14T15:45:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Customer',
    role: 'customer',
    createdAt: '2024-01-02T00:00:00Z'
  }
];