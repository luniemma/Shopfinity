# Terraform Outputs for Shopfinity EKS Infrastructure

# Cluster Information
output "cluster_id" {
  description = "EKS cluster ID"
  value       = module.eks.cluster_id
}

output "cluster_arn" {
  description = "EKS cluster ARN"
  value       = module.eks.cluster_arn
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_version" {
  description = "The Kubernetes version for the EKS cluster"
  value       = module.eks.cluster_version
}

output "cluster_platform_version" {
  description = "Platform version for the EKS cluster"
  value       = module.eks.cluster_platform_version
}

output "cluster_status" {
  description = "Status of the EKS cluster"
  value       = module.eks.cluster_status
}

# OIDC Provider
output "cluster_oidc_issuer_url" {
  description = "The URL on the EKS cluster for the OpenID Connect identity provider"
  value       = module.eks.cluster_oidc_issuer_url
}

output "oidc_provider_arn" {
  description = "The ARN of the OIDC Provider if enabled"
  value       = module.eks.oidc_provider_arn
}

# Security Groups
output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "node_security_group_id" {
  description = "ID of the node shared security group"
  value       = module.eks.node_security_group_id
}

# Node Groups
output "eks_managed_node_groups" {
  description = "Map of attribute maps for all EKS managed node groups created"
  value       = module.eks.eks_managed_node_groups
}

output "eks_managed_node_groups_autoscaling_group_names" {
  description = "List of the autoscaling group names created by EKS managed node groups"
  value       = module.eks.eks_managed_node_groups_autoscaling_group_names
}

# Fargate
output "fargate_profiles" {
  description = "Map of attribute maps for all EKS Fargate profiles created"
  value       = module.eks.fargate_profiles
}

# VPC Information
output "vpc_id" {
  description = "ID of the VPC where the cluster is deployed"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.vpc.public_subnets
}

output "database_subnets" {
  description = "List of IDs of database subnets"
  value       = module.vpc.database_subnets
}

# Database Information
output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = var.enable_rds ? aws_db_instance.shopfinity[0].endpoint : null
  sensitive   = true
}

output "rds_port" {
  description = "RDS instance port"
  value       = var.enable_rds ? aws_db_instance.shopfinity[0].port : null
}

output "documentdb_endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = var.enable_documentdb ? aws_docdb_cluster.shopfinity[0].endpoint : null
  sensitive   = true
}

output "documentdb_port" {
  description = "DocumentDB cluster port"
  value       = var.enable_documentdb ? aws_docdb_cluster.shopfinity[0].port : null
}

output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = var.enable_elasticache ? aws_elasticache_replication_group.shopfinity[0].primary_endpoint_address : null
  sensitive   = true
}

output "redis_port" {
  description = "ElastiCache Redis port"
  value       = var.enable_elasticache ? aws_elasticache_replication_group.shopfinity[0].port : null
}

# IAM Roles
output "cluster_iam_role_name" {
  description = "IAM role name associated with EKS cluster"
  value       = module.eks.cluster_iam_role_name
}

output "cluster_iam_role_arn" {
  description = "IAM role ARN associated with EKS cluster"
  value       = module.eks.cluster_iam_role_arn
}

output "node_groups_iam_role_name" {
  description = "IAM role name associated with EKS node groups"
  value       = module.eks.eks_managed_node_groups_iam_role_name
}

output "node_groups_iam_role_arn" {
  description = "IAM role ARN associated with EKS node groups"
  value       = module.eks.eks_managed_node_groups_iam_role_arn
}

# Application IAM Roles
output "shopfinity_app_role_arn" {
  description = "IAM role ARN for Shopfinity application"
  value       = aws_iam_role.shopfinity_app.arn
}

output "cluster_autoscaler_role_arn" {
  description = "IAM role ARN for Cluster Autoscaler"
  value       = var.enable_cluster_autoscaler ? aws_iam_role.cluster_autoscaler[0].arn : null
}

output "aws_load_balancer_controller_role_arn" {
  description = "IAM role ARN for AWS Load Balancer Controller"
  value       = var.enable_aws_load_balancer_controller ? module.aws_load_balancer_controller[0].iam_role_arn : null
}

# Storage
output "s3_bucket_assets" {
  description = "S3 bucket for application assets"
  value       = aws_s3_bucket.shopfinity_assets.bucket
}

output "s3_bucket_backups" {
  description = "S3 bucket for Velero backups"
  value       = var.enable_velero ? aws_s3_bucket.velero_backups[0].bucket : null
}

# Monitoring
output "grafana_admin_password" {
  description = "Grafana admin password"
  value       = random_password.grafana_password.result
  sensitive   = true
}

output "cloudwatch_log_group_name" {
  description = "CloudWatch log group name for application logs"
  value       = aws_cloudwatch_log_group.application_logs.name
}

# Secrets
output "secrets_manager_rds_arn" {
  description = "AWS Secrets Manager ARN for RDS credentials"
  value       = var.enable_rds ? aws_secretsmanager_secret.rds_password[0].arn : null
}

output "secrets_manager_app_arn" {
  description = "AWS Secrets Manager ARN for application secrets"
  value       = aws_secretsmanager_secret.app_secrets.arn
}

# kubectl Configuration
output "kubectl_config" {
  description = "kubectl config command to connect to the cluster"
  value       = "aws eks update-kubeconfig --region ${data.aws_region.current.name} --name ${module.eks.cluster_name}"
}

# Ingress Information
output "nginx_ingress_controller_dns" {
  description = "DNS name of the NGINX Ingress Controller load balancer"
  value       = "Run: kubectl get svc nginx-ingress-ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'"
}

# Cluster Access
output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

# Cost Optimization Information
output "cost_optimization_notes" {
  description = "Cost optimization recommendations"
  value = {
    spot_instances = "Consider using spot instances for non-critical workloads"
    right_sizing = "Monitor resource usage and right-size instances"
    reserved_instances = "Use reserved instances for predictable workloads in production"
    storage_optimization = "Use gp3 volumes for better price/performance ratio"
    auto_scaling = "Cluster autoscaler is enabled to optimize costs"
  }
}

# Security Information
output "security_features" {
  description = "Security features enabled"
  value = {
    encryption_at_rest = var.enable_cluster_encryption
    encryption_in_transit = "Enabled via TLS"
    network_policies = "Enabled for pod-to-pod communication"
    rbac = "Enabled with least privilege access"
    pod_security_standards = "Restricted mode enabled"
    secrets_encryption = "AWS Secrets Manager integration"
    backup_encryption = var.enable_velero ? "KMS encrypted backups" : "Not configured"
  }
}

# Environment-specific outputs
output "environment_info" {
  description = "Environment-specific information"
  value = {
    environment = var.environment
    cluster_name = local.cluster_name
    region = data.aws_region.current.name
    account_id = data.aws_caller_identity.current.account_id
    vpc_cidr = local.vpc_cidr
    availability_zones = local.azs
  }
}