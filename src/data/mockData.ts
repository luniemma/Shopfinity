import { Product, Category, User, Review } from '../types';

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
  },
  {
    id: '5',
    name: 'African Traditional Dresses',
    slug: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    productCount: 8
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
  },
  {
    id: '7',
    name: 'Ankara Print Maxi Dress',
    description: 'Beautiful handcrafted Ankara print maxi dress with vibrant African patterns. Perfect for special occasions and cultural celebrations.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/5704850/pexels-photo-5704850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    stockCount: 25,
    featured: true,
    tags: ['ankara', 'maxi-dress', 'african-print', 'handcrafted']
  },
  {
    id: '8',
    name: 'Kente Cloth Traditional Dress',
    description: 'Authentic Kente cloth dress with traditional Ghanaian patterns. Each piece tells a story through its intricate weaving and colors.',
    price: 149.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5325574/pexels-photo-5325574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5325574/pexels-photo-5325574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.8,
    reviewCount: 64,
    inStock: true,
    stockCount: 15,
    featured: true,
    tags: ['kente', 'ghanaian', 'traditional', 'authentic']
  },
  {
    id: '9',
    name: 'Dashiki Print Midi Dress',
    description: 'Stylish dashiki print midi dress combining traditional African aesthetics with modern fashion. Comfortable and elegant.',
    price: 69.99,
    originalPrice: 89.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5325575/pexels-photo-5325575.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5325575/pexels-photo-5325575.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.6,
    reviewCount: 92,
    inStock: true,
    stockCount: 32,
    featured: false,
    tags: ['dashiki', 'midi-dress', 'modern', 'comfortable']
  },
  {
    id: '10',
    name: 'Wax Print A-Line Dress',
    description: 'Vibrant wax print A-line dress with bold geometric patterns. Made from high-quality African wax fabric with excellent drape.',
    price: 79.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5325576/pexels-photo-5325576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5325576/pexels-photo-5325576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.7,
    reviewCount: 78,
    inStock: true,
    stockCount: 28,
    featured: false,
    tags: ['wax-print', 'a-line', 'geometric', 'vibrant']
  },
  {
    id: '11',
    name: 'Bogolan Mud Cloth Dress',
    description: 'Traditional Bogolan mud cloth dress from Mali with authentic hand-painted symbols. Each symbol carries cultural significance.',
    price: 129.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5325577/pexels-photo-5325577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5325577/pexels-photo-5325577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.9,
    reviewCount: 45,
    inStock: true,
    stockCount: 12,
    featured: true,
    tags: ['bogolan', 'mud-cloth', 'mali', 'hand-painted', 'cultural']
  },
  {
    id: '12',
    name: 'Kitenge Wrap Dress',
    description: 'Elegant Kitenge wrap dress with East African prints. Features adjustable wrap design for perfect fit and comfort.',
    price: 74.99,
    originalPrice: 94.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5325578/pexels-photo-5325578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5325578/pexels-photo-5325578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.5,
    reviewCount: 103,
    inStock: true,
    stockCount: 35,
    featured: false,
    tags: ['kitenge', 'wrap-dress', 'east-african', 'adjustable']
  },
  {
    id: '13',
    name: 'Adinkra Symbol Dress',
    description: 'Beautiful dress featuring traditional Adinkra symbols from Ghana. Each symbol represents wisdom, courage, and cultural values.',
    price: 99.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5325579/pexels-photo-5325579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5325579/pexels-photo-5325579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.8,
    reviewCount: 67,
    inStock: true,
    stockCount: 20,
    featured: true,
    tags: ['adinkra', 'symbols', 'ghana', 'wisdom', 'cultural-values']
  },
  {
    id: '14',
    name: 'Shweshwe Print Dress',
    description: 'South African Shweshwe print dress with distinctive geometric patterns. Made from high-quality cotton with traditional indigo dye.',
    price: 84.99,
    category: 'african-traditional-dresses',
    image: 'https://images.pexels.com/photos/5325580/pexels-photo-5325580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    images: [
      'https://images.pexels.com/photos/5325580/pexels-photo-5325580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    stockCount: 22,
    featured: false,
    tags: ['shweshwe', 'south-african', 'geometric', 'indigo', 'cotton']
];

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
  },
  {
    id: '3',
    productId: '7',
    userId: '3',
    userName: 'Amara Okafor',
    rating: 5,
    comment: 'Absolutely stunning! The Ankara print is vibrant and the quality is exceptional. Perfect for my cultural event.',
    createdAt: '2024-01-16T12:20:00Z'
  },
  {
    id: '4',
    productId: '8',
    userId: '4',
    userName: 'Kwame Asante',
    rating: 5,
    comment: 'Authentic Kente cloth with beautiful traditional patterns. The craftsmanship is outstanding!',
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '5',
    productId: '11',
    userId: '5',
    userName: 'Fatima Diallo',
    rating: 5,
    comment: 'The Bogolan mud cloth dress is a masterpiece. Each symbol tells a story. Highly recommend!',
    createdAt: '2024-01-18T14:30:00Z'
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