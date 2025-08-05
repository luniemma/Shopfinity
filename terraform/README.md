# 🚀 Shopfinity EKS Terraform Infrastructure

Production-ready AWS EKS infrastructure for the Shopfinity eCommerce platform with enterprise-grade security, monitoring, and scalability.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Account                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     VPC (10.0.0.0/16)                      │ │
│  │                                                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │   Public    │  │   Public    │  │   Public    │        │ │
│  │  │  Subnet     │  │  Subnet     │  │  Subnet     │        │ │
│  │  │    AZ-a     │  │    AZ-b     │  │    AZ-c     │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  │         │                 │                 │              │ │
│  │    ┌────▼────┐       ┌────▼────┐       ┌────▼────┐        │ │
│  │    │   NAT   │       │   NAT   │       │   NAT   │        │ │
│  │    │ Gateway │       │ Gateway │       │ Gateway │        │ │
│  │    └────┬────┘       └────┬────┘       └────┬────┘        │ │
│  │         │                 │                 │              │ │
│  │  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐              │ │
│  │  │  Private  │  │  Private  │  │  Private  │              │ │
│  │  │  Subnet   │  │  Subnet   │  │  Subnet   │              │ │
│  │  │    AZ-a   │  │    AZ-b   │  │    AZ-c   │              │ │
│  │  └───────────┘  └───────────┘  └───────────┘              │ │
│  │         │                 │                 │              │ │
│  │  ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐              │ │
│  │  │ Database  │  │ Database  │  │ Database  │              │ │
│  │  │  Subnet   │  │  Subnet   │  │  Subnet   │              │ │
│  │  │    AZ-a   │  │    AZ-b   │  │    AZ-c   │              │ │
│  │  └───────────┘  └───────────┘  └───────────┘              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    EKS Cluster                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │   Worker    │  │   Worker    │  │   Worker    │        │ │
│  │  │   Nodes     │  │   Nodes     │  │   Nodes     │        │ │
│  │  │   (EC2)     │  │   (Spot)    │  │  (Fargate)  │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Managed Services                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │ │
│  │  │     RDS     │  │ DocumentDB  │  │ElastiCache  │        │ │
│  │  │(PostgreSQL) │  │ (MongoDB)   │  │  (Redis)    │        │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## ✨ Features

### 🔒 **Security**
- **Encryption**: EKS secrets, RDS, DocumentDB, ElastiCache, and S3 encryption
- **Network Security**: VPC with private subnets, security groups, NACLs
- **IAM**: IRSA (IAM Roles for Service Accounts) with least privilege
- **Pod Security**: Pod Security Standards (restricted mode)
- **Network Policies**: Kubernetes network policies for micro-segmentation
- **Secrets Management**: AWS Secrets Manager integration

### 📊 **Monitoring & Observability**
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization dashboards with pre-configured dashboards
- **CloudWatch**: AWS native monitoring and logging
- **Fluent Bit**: Log aggregation and forwarding
- **AlertManager**: Intelligent alerting with Slack integration

### 🚀 **Scalability**
- **Cluster Autoscaler**: Automatic node scaling based on demand
- **HPA**: Horizontal Pod Autoscaler for application scaling
- **Multiple Node Groups**: On-demand, spot, and Fargate compute options
- **Load Balancing**: AWS Load Balancer Controller with NLB/ALB support

### 💾 **Backup & DR**
- **Velero**: Kubernetes-native backup and restore
- **AWS Backup**: Automated RDS and DocumentDB backups
- **Cross-AZ**: Multi-AZ deployment for high availability
- **Point-in-time Recovery**: Database PITR capabilities

### 🏗️ **Infrastructure**
- **Multi-AZ VPC**: High availability across 3 availability zones
- **Managed Databases**: RDS PostgreSQL, DocumentDB, ElastiCache Redis
- **Container Registry**: ECR integration with vulnerability scanning
- **DNS**: External DNS with Route53 integration
- **SSL/TLS**: cert-manager with Let's Encrypt

## 🚀 Quick Start

### Prerequisites
- **AWS CLI** configured with appropriate permissions
- **Terraform** 1.0+ installed
- **kubectl** installed
- **Helm** 3.0+ installed

### 1. **Clone and Setup**
```bash
cd terraform/

# Copy example configuration
cp terraform.tfvars.example terraform.tfvars

# Edit configuration
nano terraform.tfvars
```

### 2. **Initialize Terraform**
```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

### 3. **Configure kubectl**
```bash
# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name shopfinity-dev-eks

# Verify connection
kubectl get nodes
```

### 4. **Deploy Application**
```bash
# Apply Shopfinity manifests
kubectl apply -f ../k8s/

# Check deployment status
kubectl get pods -n shopfinity
```

## 📋 Configuration

### **Environment Variables**
Set these via environment variables or terraform.tfvars:

```bash
# Required
export TF_VAR_stripe_secret_key="sk_test_..."
export TF_VAR_stripe_publishable_key="pk_test_..."

# Optional
export TF_VAR_slack_webhook_url="https://hooks.slack.com/..."
export TF_VAR_alert_email="admin@yourcompany.com"
export TF_VAR_smtp_password="your-smtp-password"
```

### **Cost Optimization**
For development environments:
```hcl
# terraform.tfvars
environment = "dev"
single_nat_gateway = true
rds_instance_class = "db.t3.micro"
documentdb_instance_class = "db.t3.medium"
elasticache_node_type = "cache.t3.micro"

node_groups = {
  general = {
    instance_types = ["t3.small"]
    min_size      = 1
    max_size      = 3
    desired_size  = 2
  }
}
```

For production environments:
```hcl
# terraform.tfvars
environment = "prod"
single_nat_gateway = false
rds_instance_class = "db.r6g.large"
documentdb_instance_class = "db.r6g.large"
elasticache_node_type = "cache.r6g.large"

node_groups = {
  general = {
    instance_types = ["m5.large", "m5.xlarge"]
    min_size      = 3
    max_size      = 20
    desired_size  = 5
  }
}
```

## 🔧 Management Commands

### **Cluster Operations**
```bash
# Scale node groups
terraform apply -var="node_groups.general.desired_size=5"

# Update cluster version
terraform apply -var="cluster_version=1.29"

# Enable/disable features
terraform apply -var="enable_velero=false"
```

### **Database Operations**
```bash
# Get database credentials
terraform output -json | jq '.rds_endpoint.value'

# Connect to RDS
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- \
  psql -h $(terraform output -raw rds_endpoint) -U shopfinity -d shopfinity

# Connect to DocumentDB
kubectl run -it --rm debug --image=mongo:6.0 --restart=Never -- \
  mongosh "mongodb://$(terraform output -raw documentdb_endpoint):27017/shopfinity"
```

### **Monitoring Access**
```bash
# Get Grafana password
terraform output -raw grafana_admin_password

# Port forward to Grafana
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80

# Access Grafana: http://localhost:3000 (admin / <password>)
```

### **Backup Operations**
```bash
# Create manual backup
kubectl create -n velero backup manual-backup-$(date +%Y%m%d-%H%M%S) \
  --include-namespaces shopfinity

# List backups
kubectl get backups -n velero

# Restore from backup
kubectl create -n velero restore restore-$(date +%Y%m%d-%H%M%S) \
  --from-backup <backup-name>
```

## 🔒 Security Best Practices

### **Network Security**
- Private subnets for worker nodes
- Security groups with least privilege
- Network policies for pod-to-pod communication
- VPC endpoints for AWS services

### **Identity and Access**
- IRSA for pod-level AWS permissions
- RBAC with least privilege principles
- Pod Security Standards (restricted mode)
- Service account automation

### **Data Protection**
- Encryption at rest for all data stores
- Encryption in transit with TLS
- AWS Secrets Manager for sensitive data
- KMS key rotation enabled

### **Monitoring and Auditing**
- CloudTrail for API auditing
- VPC Flow Logs for network monitoring
- EKS control plane logging
- Application and infrastructure metrics

## 💰 Cost Optimization

### **Development Environment**
- Single NAT Gateway: ~$45/month savings
- Spot instances: Up to 90% savings
- Smaller instance types: Significant cost reduction
- Reduced backup retention: Storage cost savings

### **Production Environment**
- Reserved instances: Up to 75% savings for predictable workloads
- Cluster autoscaler: Automatic cost optimization
- gp3 storage: Better price/performance than gp2
- Multi-AZ for availability (cost vs. reliability trade-off)

### **Monitoring Costs**
```bash
# View cost breakdown
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE
```

## 🔧 Troubleshooting

### **Common Issues**

#### 1. **Cluster Creation Fails**
```bash
# Check IAM permissions
aws sts get-caller-identity

# Verify service quotas
aws service-quotas get-service-quota \
  --service-code eks \
  --quota-code L-1194D53C
```

#### 2. **Node Groups Not Joining**
```bash
# Check node group status
aws eks describe-nodegroup \
  --cluster-name shopfinity-dev-eks \
  --nodegroup-name general

# Check CloudFormation events
aws cloudformation describe-stack-events \
  --stack-name eksctl-shopfinity-dev-eks-nodegroup-general
```

#### 3. **Pod Scheduling Issues**
```bash
# Check node capacity
kubectl describe nodes

# Check pod events
kubectl describe pod <pod-name> -n shopfinity

# Check cluster autoscaler logs
kubectl logs -n kube-system deployment/cluster-autoscaler
```

#### 4. **Database Connection Issues**
```bash
# Test database connectivity
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- \
  pg_isready -h $(terraform output -raw rds_endpoint) -p 5432

# Check security groups
aws ec2 describe-security-groups \
  --group-ids $(terraform output -raw rds_security_group_id)
```

### **Debug Commands**
```bash
# Terraform debugging
export TF_LOG=DEBUG
terraform plan

# Kubernetes debugging
kubectl get events --sort-by=.metadata.creationTimestamp

# AWS CLI debugging
aws logs describe-log-groups --log-group-name-prefix /aws/eks/
```

## 📊 Monitoring and Alerts

### **Key Metrics to Monitor**
- **Cluster Health**: Node status, pod scheduling success rate
- **Application Performance**: Response times, error rates, throughput
- **Resource Utilization**: CPU, memory, storage usage
- **Database Performance**: Connection counts, query performance
- **Cost**: Daily spend, resource utilization efficiency

### **Pre-configured Dashboards**
- Kubernetes Cluster Monitoring (Grafana ID: 7249)
- Kubernetes Pod Monitoring (Grafana ID: 6417)
- NGINX Ingress Controller (Grafana ID: 9614)
- Custom Shopfinity application dashboard

### **Alerting Rules**
- High CPU utilization (>80%)
- High memory utilization (>85%)
- Pod crash loops
- Database connection failures
- Disk space warnings

## 🚀 Deployment Environments

### **Development**
```bash
terraform workspace new dev
terraform apply -var-file="environments/dev.tfvars"
```

### **Staging**
```bash
terraform workspace new staging
terraform apply -var-file="environments/staging.tfvars"
```

### **Production**
```bash
terraform workspace new prod
terraform apply -var-file="environments/prod.tfvars"
```

## 📚 Additional Resources

### **Documentation**
- [AWS EKS Best Practices](https://aws.github.io/aws-eks-best-practices/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [EKS Module Documentation](https://registry.terraform.io/modules/terraform-aws-modules/eks/aws/latest)

### **Useful Commands**
```bash
# Terraform
terraform plan -out=tfplan
terraform apply tfplan
terraform destroy -auto-approve

# kubectl
kubectl get all -n shopfinity
kubectl logs -f deployment/backend -n shopfinity
kubectl exec -it deployment/backend -n shopfinity -- bash

# AWS CLI
aws eks list-clusters
aws eks describe-cluster --name shopfinity-dev-eks
aws rds describe-db-instances
```

---

🎉 **Your production-ready EKS infrastructure is ready for deployment!**