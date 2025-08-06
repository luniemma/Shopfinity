# Shopfinity EKS Terraform Configuration
# Customize these values for your environment

# Project Configuration
project_name = "shop"
environment  = "dev"
owner        = "DevOps Team"
cost_center  = "Engineering"

# AWS Configuration
aws_region = "us-west-2"

# EKS Cluster Configuration
cluster_version                      = "1.28"
cluster_endpoint_private_access      = true
cluster_endpoint_public_access       = true
cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]

# Node Groups Configuration
node_groups = {
  general = {
    instance_types = ["t3.medium", "t3.large"]
    capacity_type  = "ON_DEMAND"
    min_size      = 2
    max_size      = 10
    desired_size  = 3
    disk_size     = 50
    ami_type      = "AL2_x86_64"
    labels = {
      role = "general"
    }
    taints = []
  }
  
  spot = {
    instance_types = ["t3.medium", "t3.large", "t3.xlarge"]
    capacity_type  = "SPOT"
    min_size      = 0
    max_size      = 20
    desired_size  = 2
    disk_size     = 50
    ami_type      = "AL2_x86_64"
    labels = {
      role = "spot"
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
  default = {
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

# Security Configuration
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

# Networking Configuration
enable_nat_gateway    = true
single_nat_gateway    = false
enable_dns_hostnames  = true
enable_dns_support    = true

# Database Configuration
enable_rds              = true
rds_instance_class      = "db.t3.micro"

enable_documentdb       = true
documentdb_instance_class = "db.t3.medium"

enable_elasticache      = true
elasticache_node_type   = "cache.t3.micro"

# Auto Scaling Configuration
enable_cluster_autoscaler = true
enable_metrics_server     = true

# Load Balancer Configuration
enable_aws_load_balancer_controller = true

# Backup Configuration
enable_velero           = true
backup_retention_days   = 30

# Monitoring Configuration
slack_webhook_url = ""
alert_email      = ""

# Application Secrets (set via environment variables)
# export TF_VAR_stripe_secret_key="sk_test_..."
# export TF_VAR_stripe_publishable_key="pk_test_..."
# export TF_VAR_smtp_password="your-smtp-password"
stripe_secret_key      = ""
stripe_publishable_key = ""
smtp_password         = ""