# Development Environment Configuration
# Cost-optimized settings for development and testing

# Project Configuration
project_name = "shopfinity"
environment  = "dev"
owner        = "Development Team"
cost_center  = "Engineering"

# AWS Configuration
aws_region = "us-west-2"

# EKS Cluster Configuration
cluster_version                      = "1.28"
cluster_endpoint_private_access      = true
cluster_endpoint_public_access       = true
cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]

# Node Groups Configuration (Cost Optimized)
node_groups = {
  general = {
    instance_types = ["t3.small", "t3.medium"]
    capacity_type  = "ON_DEMAND"
    min_size      = 1
    max_size      = 5
    desired_size  = 2
    disk_size     = 30
    ami_type      = "AL2_x86_64"
    labels = {
      role = "general"
      environment = "dev"
    }
    taints = []
  }
  
  spot = {
    instance_types = ["t3.small", "t3.medium", "t3.large"]
    capacity_type  = "SPOT"
    min_size      = 0
    max_size      = 10
    desired_size  = 1
    disk_size     = 30
    ami_type      = "AL2_x86_64"
    labels = {
      role = "spot"
      environment = "dev"
    }
    taints = [{
      key    = "spot"
      value  = "true"
      effect = "NO_SCHEDULE"
    }]
  }
}

# Fargate Profiles (Minimal for cost)
fargate_profiles = {
  system = {
    selectors = [
      {
        namespace = "kube-system"
        labels = {
          "app.kubernetes.io/name" = "aws-load-balancer-controller"
        }
      }
    ]
  }
}

# Security Configuration
enable_irsa                = true
enable_cluster_encryption  = false  # Disabled for cost in dev
enable_cloudwatch_logging  = true

cluster_enabled_log_types = [
  "api",
  "audit"
]

# Networking Configuration (Cost Optimized)
enable_nat_gateway    = true
single_nat_gateway    = true  # Cost optimization for dev
enable_dns_hostnames  = true
enable_dns_support    = true

# Database Configuration (Minimal instances)
enable_rds              = true
rds_instance_class      = "db.t3.micro"

enable_documentdb       = false  # Disabled for cost in dev
documentdb_instance_class = "db.t3.medium"

enable_elasticache      = true
elasticache_node_type   = "cache.t3.micro"

# Auto Scaling Configuration
enable_cluster_autoscaler = true
enable_metrics_server     = true

# Load Balancer Configuration
enable_aws_load_balancer_controller = true

# Backup Configuration (Minimal retention)
enable_velero           = false  # Disabled for cost in dev
backup_retention_days   = 7

# Monitoring Configuration
slack_webhook_url = ""
alert_email      = "dev-team@yourcompany.com"