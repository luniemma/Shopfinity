# EKS Cluster Configuration
# Production-ready EKS cluster with security and monitoring

# KMS key for EKS cluster encryption
resource "aws_kms_key" "eks" {
  count = var.enable_cluster_encryption ? 1 : 0
  
  description             = "EKS Secret Encryption Key for ${local.cluster_name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-encryption-key"
  })
}

resource "aws_kms_alias" "eks" {
  count = var.enable_cluster_encryption ? 1 : 0
  
  name          = "alias/${local.cluster_name}-encryption"
  target_key_id = aws_kms_key.eks[0].key_id
}

# EKS Cluster
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"

  cluster_name    = local.cluster_name
  cluster_version = var.cluster_version

  # Networking
  vpc_id                          = module.vpc.vpc_id
  subnet_ids                      = module.vpc.private_subnets
  control_plane_subnet_ids        = module.vpc.private_subnets
  cluster_endpoint_private_access = var.cluster_endpoint_private_access
  cluster_endpoint_public_access  = var.cluster_endpoint_public_access
  cluster_endpoint_public_access_cidrs = var.cluster_endpoint_public_access_cidrs

  # Security
  cluster_additional_security_group_ids = [aws_security_group.additional_eks.id]
  
  # Encryption
  cluster_encryption_config = var.enable_cluster_encryption ? [
    {
      provider_key_arn = aws_kms_key.eks[0].arn
      resources        = ["secrets"]
    }
  ] : []

  # Logging
  cluster_enabled_log_types = var.enable_cloudwatch_logging ? var.cluster_enabled_log_types : []
  cloudwatch_log_group_retention_in_days = 30
  cloudwatch_log_group_kms_key_id = var.enable_cluster_encryption ? aws_kms_key.eks[0].arn : null

  # IRSA (IAM Roles for Service Accounts)
  enable_irsa = var.enable_irsa

  # Node Groups
  eks_managed_node_groups = {
    for name, config in var.node_groups : name => {
      name           = "${local.cluster_name}-${name}"
      instance_types = config.instance_types
      capacity_type  = config.capacity_type
      
      min_size     = config.min_size
      max_size     = config.max_size
      desired_size = config.desired_size
      
      disk_size = config.disk_size
      ami_type  = config.ami_type
      
      labels = merge(config.labels, {
        Environment = var.environment
        NodeGroup   = name
      })
      
      taints = config.taints
      
      # Launch template configuration
      create_launch_template = true
      launch_template_name   = "${local.cluster_name}-${name}"
      launch_template_use_name_prefix = true
      launch_template_version = "$Latest"
      
      # Instance metadata service configuration
      metadata_options = {
        http_endpoint               = "enabled"
        http_tokens                 = "required"
        http_put_response_hop_limit = 2
        instance_metadata_tags      = "enabled"
      }
      
      # Block device mappings
      block_device_mappings = {
        xvda = {
          device_name = "/dev/xvda"
          ebs = {
            volume_size           = config.disk_size
            volume_type           = "gp3"
            iops                  = 3000
            throughput            = 150
            encrypted             = true
            kms_key_id           = var.enable_cluster_encryption ? aws_kms_key.eks[0].arn : null
            delete_on_termination = true
          }
        }
      }
      
      # User data for additional configuration
      pre_bootstrap_user_data = <<-EOT
        #!/bin/bash
        # Install additional packages
        yum update -y
        yum install -y amazon-cloudwatch-agent
        
        # Configure CloudWatch agent
        /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
          -a fetch-config -m ec2 -s -c ssm:AmazonCloudWatch-linux
      EOT
      
      # Subnet configuration
      subnet_ids = module.vpc.private_subnets
      
      # Security groups
      vpc_security_group_ids = [aws_security_group.additional_eks.id]
      
      # Update configuration
      update_config = {
        max_unavailable_percentage = 25
      }
      
      tags = merge(local.common_tags, {
        Name = "${local.cluster_name}-${name}-node-group"
      })
    }
  }

  # Fargate Profiles
  fargate_profiles = {
    for name, config in var.fargate_profiles : name => {
      name = "${local.cluster_name}-${name}"
      selectors = config.selectors
      
      subnet_ids = module.vpc.private_subnets
      
      tags = merge(local.common_tags, {
        Name = "${local.cluster_name}-${name}-fargate"
      })
    }
  }

  # Cluster add-ons
  cluster_addons = {
    for name, config in var.cluster_addons : name => {
      addon_version     = config.addon_version
      configuration_values = config.configuration_values
      resolve_conflicts = "OVERWRITE"
      
      tags = merge(local.common_tags, {
        Name = "${local.cluster_name}-${name}-addon"
      })
    }
  }

  # AWS auth config map for cluster access
  manage_aws_auth_configmap = true
  
  aws_auth_roles = [
    {
      rolearn  = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
      username = "admin"
      groups   = ["system:masters"]
    }
  ]
  
  aws_auth_users = [
    {
      userarn  = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
      username = "admin"
      groups   = ["system:masters"]
    }
  ]

  tags = local.common_tags
}
