# 🛒 Shopfinity - Complete eCommerce Platform Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Development Setup](#development-setup)
6. [Docker Deployment](#docker-deployment)
7. [Kubernetes Deployment](#kubernetes-deployment)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Services Configuration](#services-configuration)
11. [Security](#security)
12. [Monitoring & Logging](#monitoring--logging)
13. [Troubleshooting](#troubleshooting)
14. [Contributing](#contributing)

---

## 🎯 Project Overview

**Shopfinity** is a full-stack, production-ready eCommerce platform built with modern technologies. It features a React frontend, Node.js backend, and supports multiple databases with caching and message queuing capabilities.

### ✨ Key Features
- 🛍️ **Complete eCommerce functionality** - Product catalog, shopping cart, checkout
- 👥 **User management** - Authentication, profiles, order history
- 🔐 **Admin dashboard** - Product management, user management, analytics
- 💳 **Payment processing** - Stripe integration (ready)
- 📱 **Responsive design** - Mobile-first approach with Tailwind CSS
- 🚀 **Scalable architecture** - Microservices with Docker & Kubernetes
- 📊 **Caching & messaging** - Redis for caching, RabbitMQ for async processing
- 🔒 **Security** - JWT authentication, input validation, CORS protection

### 🛠️ Technology Stack

#### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **JWT** - JSON Web Token authentication
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

#### Databases
- **PostgreSQL** - Primary database for users, orders, transactions
- **MongoDB** - Product catalog, reviews, sessions
- **Redis** - Caching and session storage

#### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Kubernetes** - Container orchestration and scaling
- **NGINX** - Reverse proxy and static file serving
- **RabbitMQ** - Message broker for async processing

---

## 🏗️ Architecture

### System Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Services      │
│   (React)       │    │   (Node.js)     │    │                 │
│   Port: 3000    │◄──►│   Port: 5000    │◄──►│ PostgreSQL:5432 │
│   Nginx         │    │   Express API   │    │ MongoDB: 27017  │
└─────────────────┘    └─────────────────┘    │ Redis: 6379     │
                                              │ RabbitMQ: 5672  │
                                              │ Redis GUI: 8081 │
                                              │ RabbitMQ UI:    │
                                              │   15672         │
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

## 📋 Prerequisites

### System Requirements
- **Node.js** 18+ 
- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git** 2.30+

### For Kubernetes Deployment
- **Kubernetes** 1.20+
- **kubectl** configured
- **Helm** 3.0+ (optional)

### Development Tools (Recommended)
- **VS Code** with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Docker
  - Kubernetes

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd shopfinity
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Start with Docker Compose
```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **RabbitMQ Management**: http://localhost:15672 (shopfinity/rabbit123)
- **Redis Commander**: http://localhost:8081 (admin/admin123)

---

## 💻 Development Setup

### Local Development (Without Docker)

#### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 2. Start Services Manually
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
- **API Docs**: http://localhost:5000/api-docs (if implemented)

### Hot Reloading
- **Frontend**: Automatic reload on file changes
- **Backend**: Uses nodemon for automatic restart

---

## 🐳 Docker Deployment

### Production Docker Setup

#### 1. Environment Configuration
```bash
# Create production environment file
cp .env.example .env.production

# Update with production values
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
```

#### 2. Build Production Images
```bash
# Build all services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### 3. SSL Configuration (Production)
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy your SSL certificates
cp your-cert.pem nginx/ssl/
cp your-key.pem nginx/ssl/

# Update nginx.conf for SSL
```

### Docker Commands Reference
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart [service-name]

# Scale services
docker-compose up --scale backend=3 -d

# Stop all services
docker-compose down

# Remove volumes (⚠️ Data loss)
docker-compose down -v

# Clean up unused images
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

# Check ingress
kubectl get ingress -n shopfinity

# View logs
kubectl logs -f deployment/backend -n shopfinity
```

### 4. Scaling
```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n shopfinity

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n shopfinity
```

---

## 📡 API Documentation

### Authentication Endpoints
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
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

### User Endpoints
```http
GET    /api/users/profile         # Get user profile
PUT    /api/users/profile         # Update user profile
GET    /api/users                 # Get all users (admin)
```

### Payment Endpoints
```http
POST   /api/payments/process      # Process payment
POST   /api/payments/create-intent # Create payment intent
POST   /api/payments/confirm/:id  # Confirm payment
```

### Request/Response Examples

#### Login Request
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response
```json
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

### PostgreSQL Schema (Users, Orders, Transactions)

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    phone VARCHAR(20),
    date_of_birth DATE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Schema (Products, Reviews, Sessions)

#### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  image: String,
  images: [String],
  rating: Number,
  reviewCount: Number,
  inStock: Boolean,
  stockCount: Number,
  featured: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Reviews Collection
```javascript
{
  _id: ObjectId,
  productId: String,
  userId: String,
  userName: String,
  rating: Number,
  comment: String,
  createdAt: Date
}
```

---

## ⚙️ Services Configuration

### Redis Configuration
```conf
# Memory Management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Security
requirepass redis123

# Networking
bind 0.0.0.0
port 6379
```

### RabbitMQ Queues
- **order.created** - New order processing
- **order.updated** - Order status changes
- **payment.processed** - Payment confirmations
- **inventory.updated** - Stock level changes
- **email.notifications** - Email sending
- **sms.notifications** - SMS sending

### NGINX Configuration
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
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

### Security Headers
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

---

## 📊 Monitoring & Logging

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000/health

# Database connections
docker-compose exec backend npm run health-check
```

### Logging
- **Structured Logging** - JSON format
- **Log Levels** - Error, Warn, Info, Debug
- **Request Logging** - Morgan middleware
- **Error Tracking** - Centralized error handling

### Monitoring (Kubernetes)
- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards
- **ServiceMonitors** - Automatic service discovery
- **Alerting** - Custom alert rules

### Key Metrics to Monitor
- **Response Time** - API endpoint performance
- **Error Rate** - 4xx/5xx responses
- **Database Connections** - Connection pool usage
- **Memory Usage** - Container memory consumption
- **CPU Usage** - Container CPU utilization
- **Cache Hit Rate** - Redis cache effectiveness

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Redis Connection Failed
```bash
# Check Redis status
docker-compose logs redis

# Test Redis connection
docker-compose exec backend npm run test-redis

# Restart Redis
docker-compose restart redis
```

#### 2. Database Connection Issues
```bash
# Check database logs
docker-compose logs postgres
docker-compose logs mongo

# Test database connections
docker-compose exec backend npm run test-db

# Reset databases
docker-compose down -v
docker-compose up -d
```

#### 3. Frontend Build Errors
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

#### 4. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Change ports in docker-compose.yml
ports:
  - "3001:80"  # Use different host port
```

#### 5. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -aG docker $USER
```

### Debug Commands
```bash
# View all container logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f backend

# Execute commands in container
docker-compose exec backend bash

# Check container resource usage
docker stats

# Inspect container configuration
docker inspect shopfinity-backend
```

### Performance Issues
```bash
# Check resource usage
docker-compose exec backend top

# Monitor database queries
docker-compose exec postgres pg_stat_activity

# Check Redis memory usage
docker-compose exec redis redis-cli info memory

# Profile Node.js application
docker-compose exec backend npm run profile
```

---

## 🤝 Contributing

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
- **Husky** - Pre-commit hooks
- **Jest** - Unit testing

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Code Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Backward compatibility maintained

---

## 📚 Additional Resources

### Documentation Links
- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Redis Documentation](https://redis.io/documentation)

### Useful Commands Cheat Sheet
```bash
# Docker
docker-compose up -d                    # Start services
docker-compose down                     # Stop services
docker-compose logs -f [service]        # View logs
docker-compose exec [service] bash      # Access container

# Kubernetes
kubectl get pods -n shopfinity          # List pods
kubectl logs -f deployment/backend      # View logs
kubectl scale deployment backend --replicas=5  # Scale
kubectl port-forward svc/frontend 8080:80      # Port forward

# Database
psql -h localhost -U shopfinity -d shopfinity_db  # PostgreSQL
mongosh mongodb://localhost:27017/shopfinity      # MongoDB
redis-cli -h localhost -p 6379                    # Redis
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

**🎉 Happy coding with Shopfinity!**