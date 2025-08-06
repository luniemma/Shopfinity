# Backup and Disaster Recovery Configuration
# Velero for Kubernetes backup and AWS backup services

# S3 bucket for Velero backups
resource "aws_s3_bucket" "velero_backups" {
  count = var.enable_velero ? 1 : 0
  
  bucket = "${local.cluster_name}-velero-backups"

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "velero_backups" {
  count = var.enable_velero ? 1 : 0
  
  bucket = aws_s3_bucket.velero_backups[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "velero_backups" {
  count = var.enable_velero ? 1 : 0
  
  bucket = aws_s3_bucket.velero_backups[0].id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.velero[0].arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "velero_backups" {
  count = var.enable_velero ? 1 : 0
  
  bucket = aws_s3_bucket.velero_backups[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "velero_backups" {
  count = var.enable_velero ? 1 : 0
  
  bucket = aws_s3_bucket.velero_backups[0].id

  rule {
    id     = "backup_lifecycle"
    status = "Enabled"

    filter {
      prefix = ""
    }

    expiration {
      days = var.backup_retention_days
    }

    noncurrent_version_expiration {
      noncurrent_days = 7
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# KMS key for Velero backups
resource "aws_kms_key" "velero" {
  count = var.enable_velero ? 1 : 0
  
  description             = "KMS key for Velero backups"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-velero-kms"
  })
}

resource "aws_kms_alias" "velero" {
  count = var.enable_velero ? 1 : 0
  
  name          = "alias/${local.cluster_name}-velero"
  target_key_id = aws_kms_key.velero[0].key_id
}

# IAM role for Velero
resource "aws_iam_role" "velero" {
  count = var.enable_velero ? 1 : 0
  
  name = "${local.cluster_name}-velero"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRoleWithWebIdentity"
        Effect = "Allow"
        Principal = {
          Federated = module.eks.oidc_provider_arn
        }
        Condition = {
          StringEquals = {
            "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:velero:velero"
            "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "velero" {
  count = var.enable_velero ? 1 : 0
  
  name = "${local.cluster_name}-velero"
  role = aws_iam_role.velero[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeVolumes",
          "ec2:DescribeSnapshots",
          "ec2:CreateTags",
          "ec2:CreateVolume",
          "ec2:CreateSnapshot",
          "ec2:DeleteSnapshot"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:PutObject",
          "s3:AbortMultipartUpload",
          "s3:ListMultipartUploadParts"
        ]
        Resource = "${aws_s3_bucket.velero_backups[0].arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.velero_backups[0].arn
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = aws_kms_key.velero[0].arn
      }
    ]
  })
}

# Velero installation
resource "helm_release" "velero" {
  count = var.enable_velero ? 1 : 0
  
  name       = "velero"
  repository = "https://vmware-tanzu.github.io/helm-charts"
  chart      = "velero"
  namespace  = "velero"
  version    = "5.0.2"

  create_namespace = true

  values = [
    yamlencode({
      serviceAccount = {
        server = {
          annotations = {
            "eks.amazonaws.com/role-arn" = aws_iam_role.velero[0].arn
          }
        }
      }
      
      configuration = {
        provider = "aws"
        
        backupStorageLocation = {
          name = "default"
          provider = "aws"
          bucket = aws_s3_bucket.velero_backups[0].bucket
          config = {
            region = data.aws_region.current.name
            kmsKeyId = aws_kms_key.velero[0].arn
          }
        }
        
        volumeSnapshotLocation = {
          name = "default"
          provider = "aws"
          config = {
            region = data.aws_region.current.name
          }
        }
      }
      
      schedules = {
        daily = {
          disabled = false
          schedule = "0 2 * * *"
          template = {
            ttl = "720h" # 30 days
            includedNamespaces = ["shopfinity"]
            storageLocation = "default"
            volumeSnapshotLocations = ["default"]
          }
        }
        
        weekly = {
          disabled = false
          schedule = "0 3 * * 0"
          template = {
            ttl = "2160h" # 90 days
            includedNamespaces = ["shopfinity"]
            storageLocation = "default"
            volumeSnapshotLocations = ["default"]
          }
        }
      }
      
      metrics = {
        enabled = true
        serviceMonitor = {
          enabled = true
        }
      }
      
      kubectl = {
        image = {
          repository = "bitnami/kubectl"
          tag = "1.28"
        }
      }
    })
  ]

  depends_on = [module.eks, helm_release.kube_prometheus_stack]
}

# AWS Backup for RDS and other AWS services
resource "aws_backup_vault" "shopfinity" {
  name        = "${local.cluster_name}-backup-vault"
  kms_key_arn = aws_kms_key.backup.arn

  tags = local.common_tags
}

resource "aws_kms_key" "backup" {
  description             = "KMS key for AWS Backup"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-backup-kms"
  })
}

resource "aws_backup_plan" "shopfinity" {
  name = "${local.cluster_name}-backup-plan"

  rule {
    rule_name         = "daily_backup"
    target_vault_name = aws_backup_vault.shopfinity.name
    schedule          = "cron(0 5 ? * * *)" # Daily at 5 AM

    lifecycle {
      cold_storage_after = 30
      delete_after       = var.backup_retention_days
    }

    recovery_point_tags = local.common_tags
  }

  rule {
    rule_name         = "weekly_backup"
    target_vault_name = aws_backup_vault.shopfinity.name
    schedule          = "cron(0 6 ? * SUN *)" # Weekly on Sunday at 6 AM

    lifecycle {
      cold_storage_after = 30
      delete_after       = 365
    }

    recovery_point_tags = merge(local.common_tags, {
      BackupType = "Weekly"
    })
  }

  tags = local.common_tags
}

# IAM role for AWS Backup
resource "aws_iam_role" "backup" {
  name = "${local.cluster_name}-backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

# Backup selection for RDS
resource "aws_backup_selection" "rds" {
  count = var.enable_rds ? 1 : 0
  
  iam_role_arn = aws_iam_role.backup.arn
  name         = "${local.cluster_name}-rds-backup"
  plan_id      = aws_backup_plan.shopfinity.id

  resources = [
    aws_db_instance.shopfinity[0].arn
  ]

  condition {
    string_equals {
      key   = "aws:ResourceTag/Environment"
      value = var.environment
    }
  }
}

# Backup selection for DocumentDB
resource "aws_backup_selection" "documentdb" {
  count = var.enable_documentdb ? 1 : 0
  
  iam_role_arn = aws_iam_role.backup.arn
  name         = "${local.cluster_name}-docdb-backup"
  plan_id      = aws_backup_plan.shopfinity.id

  resources = [
    aws_docdb_cluster.shopfinity[0].arn
  ]

  condition {
    string_equals {
      key   = "aws:ResourceTag/Environment"
      value = var.environment
    }
  }
}