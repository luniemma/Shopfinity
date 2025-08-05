#!/bin/bash

# Shopfinity Kubernetes Deployment Script
set -e

echo "🚀 Deploying Shopfinity eCommerce Platform to Kubernetes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if we can connect to Kubernetes cluster
if ! kubectl cluster-info &> /dev/null; then
    print_error "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

print_status "Connected to Kubernetes cluster successfully"

# Create namespace
print_status "Creating namespace..."
kubectl apply -f namespace.yaml

# Apply ConfigMaps and Secrets
print_status "Applying ConfigMaps and Secrets..."
kubectl apply -f configmaps/
kubectl apply -f secrets/

print_warning "Please update the secrets in k8s/secrets/app-secrets.yaml with your actual base64 encoded values!"

# Apply Storage
print_status "Setting up persistent storage..."
kubectl apply -f storage/

# Deploy Databases
print_status "Deploying databases..."
kubectl apply -f databases/

# Deploy Cache and Messaging
print_status "Deploying Redis cache and RabbitMQ..."
kubectl apply -f cache/
kubectl apply -f messaging/

# Wait for databases to be ready
print_status "Waiting for databases to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n shopfinity --timeout=300s
kubectl wait --for=condition=ready pod -l app=mongodb -n shopfinity --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n shopfinity --timeout=300s
kubectl wait --for=condition=ready pod -l app=rabbitmq -n shopfinity --timeout=300s

# Run database migrations and seeding
print_status "Running database migrations and seeding..."
kubectl apply -f jobs/

# Deploy Backend
print_status "Deploying backend services..."
kubectl apply -f backend/

# Deploy Frontend
print_status "Deploying frontend..."
kubectl apply -f frontend/

# Apply Security Policies
print_status "Applying security policies..."
kubectl apply -f security/

# Apply Ingress
print_status "Setting up ingress..."
kubectl apply -f ingress/

# Apply Monitoring (optional)
if [ "$1" = "--with-monitoring" ]; then
    print_status "Setting up monitoring..."
    kubectl apply -f monitoring/
fi

# Apply Backup CronJobs
print_status "Setting up backup jobs..."
kubectl apply -f backup/

# Wait for deployments to be ready
print_status "Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/backend -n shopfinity --timeout=300s
kubectl wait --for=condition=available deployment/frontend -n shopfinity --timeout=300s

print_success "Shopfinity eCommerce Platform deployed successfully!"

# Display access information
echo ""
echo "🌐 Access Information:"
echo "=================================="
echo "Frontend: https://shopfinity.example.com"
echo "Backend API: https://api.shopfinity.example.com"
echo "RabbitMQ Management: https://admin.shopfinity.example.com"
echo ""
echo "📋 Useful Commands:"
echo "=================================="
echo "Check pod status: kubectl get pods -n shopfinity"
echo "View logs: kubectl logs -f deployment/backend -n shopfinity"
echo "Scale backend: kubectl scale deployment backend --replicas=5 -n shopfinity"
echo "Port forward (local testing): kubectl port-forward svc/frontend-service 8080:80 -n shopfinity"
echo ""
echo "🔧 Next Steps:"
echo "=================================="
echo "1. Update DNS records to point to your ingress controller"
echo "2. Configure SSL certificates (cert-manager recommended)"
echo "3. Update secrets with your actual credentials"
echo "4. Configure monitoring and alerting"
echo "5. Set up CI/CD pipeline for automated deployments"
echo ""
print_success "Deployment completed! 🎉"