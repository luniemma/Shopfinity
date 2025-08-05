const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cacheService = require('./services/cacheService');
const messageService = require('./services/messageService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Shopfinity Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  // Initialize services
  initializeServices();
});

// Initialize Redis and RabbitMQ services
async function initializeServices() {
  try {
    // Connect to Redis with retry logic
    console.log('🔄 Initializing Redis connection...');
    let redisRetries = 0;
    const maxRedisRetries = 5;
    
    while (redisRetries < maxRedisRetries) {
      try {
        await cacheService.connect();
        break;
      } catch (error) {
        redisRetries++;
        console.log(`Redis connection attempt ${redisRetries}/${maxRedisRetries} failed:`, error.message);
        if (redisRetries < maxRedisRetries) {
          console.log('Retrying Redis connection in 5 seconds...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          console.error('❌ Redis connection failed after all retries. Continuing without Redis.');
        }
      }
    }
    
    // Connect to RabbitMQ with retry logic
    console.log('🔄 Initializing RabbitMQ connection...');
    let rabbitmqRetries = 0;
    const maxRabbitmqRetries = 5;
    
    while (rabbitmqRetries < maxRabbitmqRetries) {
      try {
        await messageService.connect();
        break;
      } catch (error) {
        rabbitmqRetries++;
        console.log(`RabbitMQ connection attempt ${rabbitmqRetries}/${maxRabbitmqRetries} failed:`, error.message);
        if (rabbitmqRetries < maxRabbitmqRetries) {
          console.log('Retrying RabbitMQ connection in 5 seconds...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          console.error('❌ RabbitMQ connection failed after all retries. Continuing without RabbitMQ.');
        }
      }
    }
    
    // Set up message consumers
    if (messageService.isConnected) {
      setupMessageConsumers();
    }
    
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing services:', error);
  }
}

// Set up message consumers
function setupMessageConsumers() {
  // Order processing consumer
  messageService.consume('order.created', async (message) => {
    console.log('Processing new order:', message);
    // Add order processing logic here
  });

  // Email notification consumer
  messageService.consume('email.notifications', async (message) => {
    console.log('Sending email notification:', message);
    // Add email sending logic here
  });

  // Inventory update consumer
  messageService.consume('inventory.updated', async (message) => {
    console.log('Updating inventory:', message);
    // Add inventory update logic here
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  cacheService.disconnect();
  messageService.disconnect();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  cacheService.disconnect();
  messageService.disconnect();
  process.exit(0);
});