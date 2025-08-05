# 🛒 Shopfinity - Complete eCommerce Platform

<div align="center">

![Shopfinity Logo](https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=1)

**A modern, full-stack eCommerce platform built with React, Node.js, and microservices architecture**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue?logo=kubernetes)](https://kubernetes.io)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://typescriptlang.org)

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🐳 Docker](#-docker-deployment) • [☸️ Kubernetes](#️-kubernetes-deployment) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 Project Overview

**Shopfinity** is a production-ready, full-stack eCommerce platform featuring modern web technologies, microservices architecture, and enterprise-level scalability. Perfect for learning modern web development or building a real eCommerce business.

### ✨ Key Features

🛍️ **Complete eCommerce Functionality**
- Product catalog with categories and search
- Shopping cart and wishlist
- Secure checkout with Stripe integration
- Order management and tracking
- User authentication and profiles

👥 **User Management**
- Customer registration and login
- User profiles with order history
- Address book and payment methods
- Admin dashboard for management

🔐 **Security & Performance**
- JWT authentication
- Redis caching for performance
- RabbitMQ for async processing
- Input validation and sanitization
- Rate limiting and CORS protection

📱 **Modern UI/UX**
- Responsive design (mobile-first)
- Beautiful Tailwind CSS styling
- Interactive components with Lucide icons
- Loading states and error handling

🚀 **Scalable Architecture**
- Microservices with Docker containers
- Kubernetes orchestration ready
- Multiple database support
- Horizontal scaling capabilities

---

## 🛠️ Technology Stack

<table>
<tr>
<td>

**Frontend**
- React 18 + TypeScript
- Tailwind CSS
- Vite (build tool)
- Lucide React (icons)
- Context API (state)

</td>
<td>

**Backend**
- Node.js + Express
- TypeScript
- JWT Authentication
- Helmet (security)
- Morgan (logging)

</td>
</tr>
<tr>
<td>

**Databases**
- PostgreSQL (users, orders)
- MongoDB (products, reviews)
- Redis (caching, sessions)

</td>
<td>

**Infrastructure**
- Docker & Docker Compose
- Kubernetes manifests
- NGINX (reverse proxy)
- RabbitMQ (messaging)

</td>
</tr>
</table>

---

## 🚀 Quick Start

Get Shopfinity running in under 5 minutes!

### Prerequisites
- **Docker** 20.10+ and **Docker Compose** 2.0+
- **Node.js** 18+ (for local development)
- **Git** 2.30+

### 1. Clone & Setup
```bash
# Clone the repository
git clone <your-repository-url>
cd shopfinity

# Copy environment file
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` with your settings:
```bash
# Database passwords
DB_PASSWORD=your_secure_postgres_password
MONGO_PASSWORD=your_secure_mongo_password
REDIS_PASSWORD=redis123

# JWT secret
JWT_SECRET=your_super_secret_jwt_key

# Stripe keys (optional for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Start with Docker
```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Your Application
- **🌐 Frontend**: http://localhost:3000
- **🔧 Backend API**: http://localhost:5000
- **📊 RabbitMQ Management**: http://localhost:15672 (shopfinity/rabbit123)
- **💾 Redis Commander**: http://localhost:8081 (admin/admin123)

**🎉 That's it! Your eCommerce platform is running!**

---

## 📖 Documentation

### 📋 Table of Contents
1. [🏗️ Architecture](#️-architecture)
2. [💻 Development Setup](#-development-setup)
3. [🐳 Docker Deployment](#-docker-deployment)
4. [☸️ Kubernetes Deployment](#️-kubernetes-deployment)
5. [📡 API Documentation](#-api-documentation)
6. [🗄️ Database Schema](#️-database-schema)
7. [🔒 Security](#-security)
8. [📊 Monitoring](#-monitoring)
9. [🔧 Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Services      │
│   (React)       │    │   (Node.js)     │    │                 │
│   Port: 3000    │◄──►│   Port: 5000    │◄──►│ PostgreSQL:5432 │
│   Nginx         │    │   Express API   │    │ MongoDB: 27017  │
└─────────────────┘    └─────────────────┘    │ Redis: 6379     │
                                              │ RabbitMQ: 5672  │
                                              │ Management UIs  │
                                              └─────────────────┘
```

### Data Flow
1. **User Interaction** → Frontend (React)
2. **API Requests** → Backend (Express.js)
3. **Authentication** → JWT validation
4. **Data Storage** → PostgreSQL/MongoDB
5. **Caching** → Redis for performance
6. **Async Processing** → RabbitMQ for background tasks

---

## 💻 Development Setup

### Local Development (Without Docker)

#### 1. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

#### 2. Start Services
```bash
# Terminal 1: Start databases (Docker)
docker-compose up postgres mongo redis rabbitmq -d

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start frontend
npm run dev
```

#### 3. Development URLs
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5000
- **Hot Reload**: Automatic on file changes

---

## 🐳 Docker Deployment

### Production Docker Setup

#### 1. Environment Configuration
```bash
# Create production environment
cp .env.example .env.production

# Update with production values
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
```

#### 2. Build & Deploy
```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### 3. SSL Configuration
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy SSL certificates
cp your-cert.pem nginx/ssl/
cp your-key.pem nginx/ssl/
```

### Docker Commands Reference
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Scale services
docker-compose up --scale backend=3 -d

# Stop all services
docker-compose down

# Clean up
docker system prune -a
```

---

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (local or cloud)
- kubectl configured
- NGINX Ingress Controller
- cert-manager (for SSL)

### 1. Quick Deployment
```bash
cd k8s/

# Update secrets (IMPORTANT!)
# Edit secrets/app-secrets.yaml with base64 encoded values
echo -n "your-secret" | base64

# Deploy everything
chmod +x deploy.sh
./deploy.sh

# Or with monitoring
./deploy.sh --with-monitoring
```

### 2. Manual Deployment
```bash
# Apply in order
kubectl apply -f namespace.yaml
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f storage/
kubectl apply -f databases/
kubectl apply -f cache/
kubectl apply -f messaging/
kubectl apply -f jobs/
kubectl apply -f backend/
kubectl apply -f frontend/
kubectl apply -f security/
kubectl apply -f ingress/
kubectl apply -f backup/
```

### 3. Verify Deployment
```bash
# Check all pods
kubectl get pods -n shopfinity

# Check services
kubectl get svc -n shopfinity

# View logs
kubectl logs -f deployment/backend -n shopfinity
```

### 4. Access Information
- **Frontend**: https://shopfinity.example.com
- **Backend API**: https://api.shopfinity.example.com
- **RabbitMQ Management**: https://admin.shopfinity.example.com

---

## 📡 API Documentation

### Authentication Endpoints
```http
POST /api/auth/login       # User login
POST /api/auth/register    # User registration
POST /api/auth/logout      # User logout
GET  /api/auth/me          # Get current user
```

### Product Endpoints
```http
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
```

### Order Endpoints
```http
GET    /api/orders                # Get user orders
GET    /api/orders/:id            # Get single order
POST   /api/orders                # Create order
PUT    /api/orders/:id            # Update order status (admin)
```

### Example API Request
```bash
# Login request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Response
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer"
  },
  "token": "jwt-token-here"
}
```

---

## 🗄️ Database Schema

### PostgreSQL (Users, Orders, Transactions)
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB (Products, Reviews, Sessions)
```javascript
// Products collection
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  rating: Number,
  inStock: Boolean,
  featured: Boolean,
  tags: [String]
}

// Reviews collection
{
  _id: ObjectId,
  productId: String,
  userId: String,
  rating: Number,
  comment: String,
  createdAt: Date
}
```

---

## 🔒 Security

### Authentication & Authorization
- **JWT Tokens** - Stateless authentication
- **Password Hashing** - bcrypt with salt rounds
- **Role-based Access** - Customer/Admin roles
- **Session Management** - Redis-based sessions

### API Security
- **CORS Protection** - Configured origins
- **Rate Limiting** - 100 requests per 15 minutes
- **Input Validation** - express-validator
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Helmet.js middleware

### Infrastructure Security
- **Network Policies** - Kubernetes pod isolation
- **Pod Security Policies** - Non-root containers
- **Secrets Management** - Kubernetes secrets
- **SSL/TLS** - HTTPS encryption

---

## 📊 Monitoring

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000/health

# Service status
docker-compose ps
```

### Key Metrics
- **Response Time** - API endpoint performance
- **Error Rate** - 4xx/5xx responses
- **Database Connections** - Connection pool usage
- **Memory Usage** - Container memory consumption
- **Cache Hit Rate** - Redis cache effectiveness

### Logging
- **Structured Logging** - JSON format
- **Request Logging** - Morgan middleware
- **Error Tracking** - Centralized error handling

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Redis Connection Failed
```bash
# Check Redis status
docker-compose logs redis

# Restart Redis
docker-compose restart redis

# Test connection
docker-compose exec backend npm run test-redis
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres mongo

# Reset databases
docker-compose down -v
docker-compose up -d
```

#### 3. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Change ports in docker-compose.yml
ports:
  - "3001:80"  # Use different host port
```

#### 4. Build Errors
```bash
# Clear cache and rebuild
docker-compose build --no-cache
docker system prune -a
```

### Debug Commands
```bash
# View all logs
docker-compose logs

# Follow specific service
docker-compose logs -f backend

# Execute commands in container
docker-compose exec backend bash

# Check resource usage
docker stats
```

---

## 🚀 Features

### Customer Features
- **Product Browsing** - Search, filter, and categorize products
- **Shopping Cart** - Add, remove, and modify cart items
- **User Accounts** - Registration, login, and profile management
- **Order Management** - Place orders and track status
- **Payment Processing** - Secure Stripe integration
- **Responsive Design** - Works on all devices

### Admin Features
- **Product Management** - Add, edit, and delete products
- **Order Management** - View and update order status
- **User Management** - View customer information
- **Analytics Dashboard** - Sales and performance metrics
- **Inventory Tracking** - Stock level monitoring

### Technical Features
- **Caching** - Redis for improved performance
- **Message Queues** - RabbitMQ for async processing
- **Auto-scaling** - Kubernetes HPA support
- **Backup System** - Automated database backups
- **Monitoring** - Health checks and metrics
- **Security** - JWT auth, input validation, CORS

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript** - Strict mode enabled
- **ESLint** - Airbnb configuration
- **Prettier** - Code formatting
- **Testing** - Jest for unit tests

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)

### Useful Commands
```bash
# Docker
docker-compose up -d                    # Start services
docker-compose logs -f [service]        # View logs
docker-compose exec [service] bash      # Access container

# Kubernetes
kubectl get pods -n shopfinity          # List pods
kubectl logs -f deployment/backend      # View logs
kubectl scale deployment backend --replicas=5  # Scale
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Node.js Community** - For the robust backend runtime
- **Docker** - For containerization technology
- **Kubernetes** - For orchestration capabilities
- **Open Source Community** - For all the amazing tools and libraries

---

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@shopfinity.com

---

<div align="center">

**🎉 Happy coding with Shopfinity!**

Made with ❤️ by the Shopfinity team

[⬆ Back to Top](#-shopfinity---complete-ecommerce-platform)

</div>