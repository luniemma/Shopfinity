# Terraform Variables for Shopfinity EKS Infrastructure

# Project Configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "shop"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "owner" {
  description = "Owner of the infrastructure"
  type        = string
  default     = "DevOps Team"
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
  default     = "Engineering"
}

# AWS Configuration
variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-west-2"
}

# EKS Configuration
variable "cluster_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "cluster_endpoint_private_access" {
  description = "Enable private API server endpoint"
  type        = bool
  default     = true
}

variable "cluster_endpoint_public_access" {
  description = "Enable public API server endpoint"
  type        = bool
  default     = true
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "CIDR blocks that can access the public API server endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# Node Group Configuration
variable "node_groups" {
  description = "EKS node group configurations"
  type = map(object({
    instance_types = list(string)
    capacity_type  = string
    min_size      = number
    max_size      = number
    desired_size  = number
    disk_size     = number
    ami_type      = string
    labels        = map(string)
    taints        = list(object({
      key    = string
      value  = string
      effect = string
    }))
  }))
  
  default = {
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
}

# Fargate Configuration
variable "fargate_profiles" {
  description = "EKS Fargate profile configurations"
  type = map(object({
    selectors = list(object({
      namespace = string
      labels    = map(string)
    }))
  }))
  
  default = {
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
}

# Add-ons Configuration
variable "cluster_addons" {
  description = "EKS cluster add-ons"
  type = map(object({
    addon_version         = string
    configuration_values = string
  }))
  
  default = {
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
}

# Security Configuration
variable "enable_irsa" {
  description = "Enable IAM Roles for Service Accounts"
  type        = bool
  default     = true
}

variable "enable_cluster_encryption" {
  description = "Enable EKS cluster encryption"
  type        = bool
  default     = true
}

variable "cluster_encryption_config" {
  description = "EKS cluster encryption configuration"
  type = list(object({
    provider_key_arn = string
    resources        = list(string)
  }))
  default = []
}

# Monitoring Configuration
variable "enable_cloudwatch_logging" {
  description = "Enable CloudWatch logging for EKS"
  type        = bool
  default     = true
}

variable "cluster_enabled_log_types" {
  description = "List of control plane logging to enable"
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

# Networking Configuration
variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use single NAT Gateway (cost optimization for dev)"
  type        = bool
  default     = false
}

variable "enable_dns_hostnames" {
  description = "Enable DNS hostnames in VPC"
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "Enable DNS support in VPC"
  type        = bool
  default     = true
}

# Database Configuration
variable "enable_rds" {
  description = "Enable RDS PostgreSQL instance"
  type        = bool
  default     = true
}

variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "enable_documentdb" {
  description = "Enable DocumentDB (MongoDB-compatible)"
  type        = bool
  default     = true
}

variable "documentdb_instance_class" {
  description = "DocumentDB instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "enable_elasticache" {
  description = "Enable ElastiCache Redis"
  type        = bool
  default     = true
}

variable "elasticache_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

# Auto Scaling Configuration
variable "enable_cluster_autoscaler" {
  description = "Enable cluster autoscaler"
  type        = bool
  default     = true
}

variable "enable_metrics_server" {
  description = "Enable metrics server"
  type        = bool
  default     = true
}

# Load Balancer Configuration
variable "enable_aws_load_balancer_controller" {
  description = "Enable AWS Load Balancer Controller"
  type        = bool
  default     = true
}

# Backup Configuration
variable "enable_velero" {
  description = "Enable Velero for backup and disaster recovery"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 30
}