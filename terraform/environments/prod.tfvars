# Production Environment Configuration
# Full production settings with high availability and security

# Project Configuration
project_name = "shopfinity"
environment  = "prod"
owner        = "Platform Team"
cost_center  = "Production"

# AWS Configuration
aws_region = "us-west-2"

# EKS Cluster Configuration
cluster_version                      = "1.28"
cluster_endpoint_private_access      = true
cluster_endpoint_public_access       = false  # Private only for production
cluster_endpoint_public_access_cidrs = []

# Node Groups Configuration (Production Scale)
node_groups = {
  general = {
    instance_types = ["m5.large", "m5.xlarge"]
    capacity_type  = "ON_DEMAND"
    min_size      = 3
    max_size      = 20
    desired_size  = 5
    disk_size     = 100
    ami_type      = "AL2_x86_64"
    labels = {
      role = "general"
      environment = "prod"
    }
    taints = []
  }
  
  spot = {
    instance_types = ["m5.large", "m5.xlarge", "m5.2xlarge"]
    capacity_type  = "SPOT"
    min_size      = 2
    max_size      = 30
    desired_size  = 5
    disk_size     = 100
    ami_type      = "AL2_x86_64"
    labels = {
      role = "spot"
      environment = "prod"
    }
    taints = [{
      key    = "spot"
      value  = "true"
      effect = "NO_SCHEDULE"
    }]
  }
  
  memory_optimized = {
    instance_types = ["r5.large", "r5.xlarge"]
    capacity_type  = "ON_DEMAND"
    min_size      = 0
    max_size      = 10
    desired_size  = 2
    disk_size     = 100
    ami_type      = "AL2_x86_64"
    labels = {
      role = "memory-optimized"
      environment = "prod"
    }
    taints = [{
      key    = "memory-optimized"
      value  = "true"
      effect = "NO_SCHEDULE"
    }]
  }
}

# Fargate Profiles (Production)
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
  
  monitoring = {
    selectors = [
      {
        namespace = "monitoring"
        labels = {
          "compute-type" = "fargate"
        }
      }
    ]
  }
}

# Security Configuration (Maximum Security)
enable_irsa                = true
enable_cluster_encryption  = true
enable_cloudwatch_logging  = true

cluster_enabled_log_types = [
  "api",
  "audit",
  "authenticator",
  "controllerManager",
  "scheduler"
]

# Networking Configuration (High Availability)
enable_nat_gateway    = true
single_nat_gateway    = false  # Multi-AZ NAT for HA
enable_dns_hostnames  = true
enable_dns_support    = true

# Database Configuration (Production Scale)
enable_rds              = true
rds_instance_class      = "db.r6g.large"

enable_documentdb       = true
documentdb_instance_class = "db.r6g.large"

enable_elasticache      = true
elasticache_node_type   = "cache.r6g.large"

# Auto Scaling Configuration
enable_cluster_autoscaler = true
enable_metrics_server     = true

# Load Balancer Configuration
enable_aws_load_balancer_controller = true

# Backup Configuration (Extended Retention)
enable_velero           = true
backup_retention_days   = 90

# Monitoring Configuration
slack_webhook_url = "https://hooks.slack.com/services/YOUR/PRODUCTION/WEBHOOK"
alert_email      = "production-alerts@yourcompany.com"