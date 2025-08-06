# Staging Environment Configuration
# Production-like settings with some cost optimizations

# Project Configuration
project_name = "shopfinity"
environment  = "staging"
owner        = "DevOps Team"
cost_center  = "Engineering"

# AWS Configuration
aws_region = "us-west-2"

# EKS Cluster Configuration
cluster_version                      = "1.28"
cluster_endpoint_private_access      = true
cluster_endpoint_public_access       = true
cluster_endpoint_public_access_cidrs = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]  # Private networks only

# Node Groups Configuration
node_groups = {
  general = {
    instance_types = ["t3.medium", "t3.large"]
    capacity_type  = "ON_DEMAND"
    min_size      = 2
    max_size      = 8
    desired_size  = 3
    disk_size     = 50
    ami_type      = "AL2_x86_64"
    labels = {
      role = "general"
      environment = "staging"
    }
    taints = []
  }
  
  spot = {
    instance_types = ["t3.medium", "t3.large", "t3.xlarge"]
    capacity_type  = "SPOT"
    min_size      = 0
    max_size      = 15
    desired_size  = 2
    disk_size     = 50
    ami_type      = "AL2_x86_64"
    labels = {
      role = "spot"
      environment = "staging"
    }
    taints = [{
      key    = "spot"
      value  = "true"
      effect = "NO_SCHEDULE"
    }]
  }
}

# Fargate Profiles
fargate_profiles = {
  system = {
    selectors = [
      {
        namespace = "kube-system"
        labels = {
          "app.kubernetes.io/name" = "aws-load-balancer-controller"
        }
      },
      {
        namespace = "shopfinity"
        labels = {
          "compute-type" = "fargate"
        }
      }
    ]
  }
}

# Security Configuration
enable_irsa                = true
enable_cluster_encryption  = true
enable_cloudwatch_logging  = true

cluster_enabled_log_types = [
  "api",
  "audit",
  "authenticator",
  "controllerManager"
]

# Networking Configuration
enable_nat_gateway    = true
single_nat_gateway    = false  # Multi-AZ for staging
enable_dns_hostnames  = true
enable_dns_support    = true

# Database Configuration
enable_rds              = true
rds_instance_class      = "db.t3.small"

enable_documentdb       = true
documentdb_instance_class = "db.t3.medium"

enable_elasticache      = true
elasticache_node_type   = "cache.t3.small"

# Auto Scaling Configuration
enable_cluster_autoscaler = true
enable_metrics_server     = true

# Load Balancer Configuration
enable_aws_load_balancer_controller = true

# Backup Configuration
enable_velero           = true
backup_retention_days   = 14

# Monitoring Configuration
slack_webhook_url = "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
alert_email      = "staging-alerts@yourcompany.com"

# Add-ons Configuration
cluster_addons = {
  coredns = {
    addon_version         = "v1.10.1-eksbuild.5"
    configuration_values = ""
  }
  
  kube-proxy = {
    addon_version         = "v1.28.2-eksbuild.2"
    configuration_values = ""
  }
  
  vpc-cni = {
    addon_version         = "v1.15.4-eksbuild.1"
    configuration_values = ""
  }
  
  aws-ebs-csi-driver = {
    addon_version         = "v1.24.0-eksbuild.1"
    configuration_values = ""
  }
}