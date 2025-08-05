# 🚀 Shopfinity Kubernetes Deployment

Complete Kubernetes manifests for deploying the Shopfinity African Fashion eCommerce Platform.

## 📋 Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured
- NGINX Ingress Controller
- cert-manager (for SSL certificates)
- Persistent Volume support

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ingress       │    │   Frontend      │    │   Backend       │
│   (NGINX)       │◄──►│   (React)       │◄──►│   (Node.js)     │
│   SSL/TLS       │    │   2 replicas    │    │   3 replicas    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌─────────────────────────────────┼─────────────────┐
                       │                                 │                 │
                       ▼                                 ▼                 ▼
              ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
              │   PostgreSQL    │    │    MongoDB      │    │     Redis       │
              │   (Users/Orders)│    │   (Products)    │    │   (Cache)       │
              └─────────────────┘    └─────────────────┘    └─────────────────┘
                                                                     │
                                                                     ▼
                                                            ┌─────────────────┐
                                                            │   RabbitMQ      │
                                                            │   (Messages)    │
                                                            └─────────────────┘
```

## 🚀 Quick Deployment

### 1. Clone and Navigate
```bash
cd k8s/
```

### 2. Update Secrets
Edit `secrets/app-secrets.yaml` with your base64 encoded secrets:
```bash
echo -n "your-secret" | base64
```

### 3. Update Configuration
Edit `configmaps/app-config.yaml` with your domain names and settings.

### 4. Deploy Everything
```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy all services
./deploy.sh

# Deploy with monitoring
./deploy.sh --with-monitoring
```

### 5. Manual Deployment (Alternative)
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

## 📦 Services Overview

### **Core Services**
- **Frontend**: React app served by NGINX (2 replicas)
- **Backend**: Node.js API with auto-scaling (3-10 replicas)
- **PostgreSQL**: User accounts, orders, transactions
- **MongoDB**: Product catalog, reviews, sessions
- **Redis**: Caching and session storage
- **RabbitMQ**: Message broker for async processing

### **Supporting Services**
- **Ingress**: NGINX with SSL termination
- **Jobs**: Database migrations and seeding
- **CronJobs**: Automated backups
- **HPA**: Horizontal Pod Autoscaling
- **Network Policies**: Security isolation

## 🔧 Configuration

### **Environment Variables**
Update `configmaps/app-config.yaml`:
```yaml
FRONTEND_URL: "https://your-domain.com"
BACKEND_URL: "https://api.your-domain.com"
```

### **Secrets**
Update `secrets/app-secrets.yaml` with base64 encoded values:
```bash
# Example: Encode a secret
echo -n "your-jwt-secret" | base64
```

### **Ingress**
Update `ingress/ingress.yaml` with your domain names:
```yaml
- host: your-domain.com
- host: api.your-domain.com
```

## 🔒 Security Features

### **Network Policies**
- Pod-to-pod communication restrictions
- Database access limited to backend only
- Frontend can only access backend

### **Pod Security**
- Non-root containers
- Read-only root filesystems
- Dropped capabilities
- Security contexts

### **RBAC**
- Service accounts with minimal permissions
- Pod Security Policies
- Network segmentation

## 📊 Monitoring & Observability

### **Health Checks**
- Liveness and readiness probes
- Database connection monitoring
- Service dependency checks

### **Metrics** (Optional)
- Prometheus ServiceMonitors
- Grafana dashboards
- Application metrics

### **Logging**
- Centralized logging ready
- Structured JSON logs
- Log aggregation support

## 🔄 Scaling & Performance

### **Horizontal Pod Autoscaling**
```bash
# Backend: 3-10 replicas based on CPU/Memory
# Frontend: 2-5 replicas based on CPU

# Manual scaling
kubectl scale deployment backend --replicas=5 -n shopfinity
```

### **Resource Limits**
- CPU and memory limits set
- Quality of Service classes
- Resource quotas

## 💾 Backup & Recovery

### **Automated Backups**
- PostgreSQL: Daily at 2 AM
- MongoDB: Daily at 3 AM
- 7-day retention policy

### **Manual Backup**
```bash
# Trigger backup job
kubectl create job --from=cronjob/postgres-backup manual-backup -n shopfinity
```

## 🛠️ Management Commands

### **Check Status**
```bash
# All pods
kubectl get pods -n shopfinity

# Services
kubectl get svc -n shopfinity

# Ingress
kubectl get ingress -n shopfinity
```

### **View Logs**
```bash
# Backend logs
kubectl logs -f deployment/backend -n shopfinity

# Frontend logs
kubectl logs -f deployment/frontend -n shopfinity

# Database logs
kubectl logs -f deployment/postgres -n shopfinity
```

### **Port Forwarding (Local Testing)**
```bash
# Frontend
kubectl port-forward svc/frontend-service 8080:80 -n shopfinity

# Backend
kubectl port-forward svc/backend-service 8081:5000 -n shopfinity

# RabbitMQ Management
kubectl port-forward svc/rabbitmq-service 15672:15672 -n shopfinity
```

### **Database Access**
```bash
# PostgreSQL
kubectl exec -it deployment/postgres -n shopfinity -- psql -U shopfinity -d shopfinity_db

# MongoDB
kubectl exec -it deployment/mongodb -n shopfinity -- mongosh shopfinity
```

## 🔧 Troubleshooting

### **Common Issues**

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name> -n shopfinity
   kubectl logs <pod-name> -n shopfinity
   ```

2. **Database connection issues**
   ```bash
   # Check database pods
   kubectl get pods -l app=postgres -n shopfinity
   
   # Test connection
   kubectl exec -it deployment/backend -n shopfinity -- nc -zv postgres-service 5432
   ```

3. **Ingress not working**
   ```bash
   # Check ingress controller
   kubectl get pods -n ingress-nginx
   
   # Check ingress rules
   kubectl describe ingress shopfinity-ingress -n shopfinity
   ```

4. **Storage issues**
   ```bash
   # Check PVCs
   kubectl get pvc -n shopfinity
   
   # Check PVs
   kubectl get pv
   ```

## 🚀 Production Checklist

- [ ] Update all secrets with production values
- [ ] Configure proper domain names
- [ ] Set up SSL certificates (cert-manager)
- [ ] Configure resource limits based on load testing
- [ ] Set up monitoring and alerting
- [ ] Configure backup storage (S3, GCS, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Configure log aggregation
- [ ] Set up disaster recovery procedures
- [ ] Security scanning and compliance

## 📈 Scaling Recommendations

### **Small Deployment (< 1000 users)**
- Frontend: 2 replicas
- Backend: 3 replicas
- Databases: Single instances

### **Medium Deployment (1000-10000 users)**
- Frontend: 3-5 replicas
- Backend: 5-10 replicas
- Consider database read replicas

### **Large Deployment (> 10000 users)**
- Frontend: 5+ replicas with CDN
- Backend: 10+ replicas with load balancing
- Database clustering and sharding
- Redis clustering
- RabbitMQ clustering

---

🎉 **Your Shopfinity eCommerce platform is now ready for Kubernetes deployment!**