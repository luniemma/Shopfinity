# 🐳 Shopfinity Docker Setup

Complete Docker configuration for the Shopfinity African Fashion E-commerce Platform.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Databases     │
│   (React)       │    │   (Node.js)     │    │                 │
│   Port: 3000    │◄──►│   Port: 5000    │◄──►│ PostgreSQL:5432 │
│   Nginx         │    │   Express API   │    │ MongoDB: 27017  │
└─────────────────┘    └─────────────────┘    │ Redis: 6379     │
                                              └─────────────────┘
```

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo>
cd shopfinity
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your credentials:
```bash
# Required configurations
DB_PASSWORD=your_secure_postgres_password
MONGO_PASSWORD=your_secure_mongo_password
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 3. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📦 Services

### Frontend (React + Nginx)
- **Port**: 3000 (mapped to 80 inside container)
- **Features**: Multi-stage build, Nginx serving, Gzip compression
- **Health Check**: Built-in nginx health endpoint

### Backend (Node.js + Express)
- **Port**: 5000
- **Features**: API endpoints, authentication, payment processing
- **Health Check**: `/health` endpoint
- **Security**: Helmet, CORS, rate limiting

### PostgreSQL Database
- **Port**: 5432
- **Usage**: User accounts, orders, transactions
- **Persistence**: Named volume `postgres_data`

### MongoDB Database
- **Port**: 27017
- **Usage**: Product catalog, reviews, sessions
- **Persistence**: Named volume `mongo_data`

### Redis Cache
- **Port**: 6379
- **Usage**: Session storage, caching
- **Persistence**: Named volume `redis_data`

## 🛠️ Development Commands

```bash
# Start only specific services
docker-compose up frontend backend

# Rebuild specific service
docker-compose build backend

# View service logs
docker-compose logs backend

# Execute commands in running container
docker-compose exec backend npm run test

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ Data loss)
docker-compose down -v
```

## 🔧 Production Deployment

### 1. Environment Setup
```bash
# Production environment variables
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
```

### 2. SSL Configuration
```bash
# Add SSL certificates to nginx/ssl/
mkdir -p nginx/ssl
# Copy your SSL certificates
cp your-cert.pem nginx/ssl/
cp your-key.pem nginx/ssl/
```

### 3. Deploy
```bash
# Production build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📊 Monitoring & Logs

### Health Checks
```bash
# Check all services
docker-compose ps

# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000/health
```

### Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Follow logs
docker-compose logs -f frontend
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: API protection
- **Non-root User**: Container security
- **Environment Variables**: Sensitive data protection

## 🗄️ Database Management

### PostgreSQL
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U shopfinity -d shopfinity_db

# Backup database
docker-compose exec postgres pg_dump -U shopfinity shopfinity_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U shopfinity shopfinity_db < backup.sql
```

### MongoDB
```bash
# Connect to MongoDB
docker-compose exec mongo mongosh shopfinity

# Backup MongoDB
docker-compose exec mongo mongodump --db shopfinity --out /data/backup

# Restore MongoDB
docker-compose exec mongo mongorestore /data/backup
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   
   # Change ports in docker-compose.yml
   ports:
     - "3001:80"  # Use different host port
   ```

2. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs postgres
   docker-compose logs mongo
   
   # Restart databases
   docker-compose restart postgres mongo
   ```

4. **Build Failures**
   ```bash
   # Clean build
   docker-compose build --no-cache
   
   # Remove unused images
   docker system prune -a
   ```

## 📈 Performance Optimization

### Production Optimizations
- Multi-stage builds for smaller images
- Nginx gzip compression
- Redis caching
- Database connection pooling
- Health checks for reliability

### Scaling
```bash
# Scale backend service
docker-compose up --scale backend=3

# Load balancer configuration needed for multiple backends
```

## 🔄 Updates & Maintenance

```bash
# Update images
docker-compose pull

# Restart with new images
docker-compose up -d

# Clean up old images
docker image prune -a
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DB_PASSWORD` | PostgreSQL password | Yes | - |
| `MONGO_PASSWORD` | MongoDB password | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | - |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | Yes | - |
| `NODE_ENV` | Environment mode | No | development |
| `FRONTEND_URL` | Frontend URL | No | http://localhost:3000 |
| `BACKEND_URL` | Backend URL | No | http://localhost:5000 |

---

🎉 **Your Shopfinity platform is now containerized and ready for deployment!**