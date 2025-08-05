# Security Configuration for Shopfinity EKS
# IAM roles, policies, and security best practices

# IAM role for Shopfinity application
resource "aws_iam_role" "shopfinity_app" {
  name = "${local.cluster_name}-app-role"

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
            "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:shopfinity:shopfinity-backend"
            "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = local.common_tags
}

# IAM policy for Shopfinity application
resource "aws_iam_role_policy" "shopfinity_app" {
  name = "${local.cluster_name}-app-policy"
  role = aws_iam_role.shopfinity_app.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.shopfinity_assets.arn,
          "${aws_s3_bucket.shopfinity_assets.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          aws_secretsmanager_secret.rds_password[0].arn,
          aws_secretsmanager_secret.app_secrets.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      }
    ]
  })
}

# S3 bucket for application assets
resource "aws_s3_bucket" "shopfinity_assets" {
  bucket = "${local.cluster_name}-assets"

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "shopfinity_assets" {
  bucket = aws_s3_bucket.shopfinity_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "shopfinity_assets" {
  bucket = aws_s3_bucket.shopfinity_assets.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "shopfinity_assets" {
  bucket = aws_s3_bucket.shopfinity_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Application secrets in AWS Secrets Manager
resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${local.cluster_name}-app-secrets"
  description             = "Application secrets for Shopfinity"
  recovery_window_in_days = 7

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    jwt_secret = random_password.jwt_secret.result
    stripe_secret_key = var.stripe_secret_key
    stripe_publishable_key = var.stripe_publishable_key
    smtp_password = var.smtp_password
  })
}

# Random passwords and secrets
resource "random_password" "jwt_secret" {
  length  = 32
  special = true
}

# Pod Security Standards
resource "kubernetes_manifest" "pod_security_policy" {
  depends_on = [module.eks]
  
  manifest = {
    apiVersion = "v1"
    kind       = "Namespace"
    metadata = {
      name = "shopfinity"
      labels = {
        "pod-security.kubernetes.io/enforce" = "restricted"
        "pod-security.kubernetes.io/audit"   = "restricted"
        "pod-security.kubernetes.io/warn"    = "restricted"
      }
    }
  }
}

# Network Policies
resource "kubernetes_manifest" "network_policy_deny_all" {
  depends_on = [module.eks, kubernetes_namespace.shopfinity]
  
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind       = "NetworkPolicy"
    metadata = {
      name      = "deny-all"
      namespace = "shopfinity"
    }
    spec = {
      podSelector = {}
      policyTypes = ["Ingress", "Egress"]
    }
  }
}

resource "kubernetes_manifest" "network_policy_allow_frontend_backend" {
  depends_on = [module.eks, kubernetes_namespace.shopfinity]
  
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind       = "NetworkPolicy"
    metadata = {
      name      = "allow-frontend-backend"
      namespace = "shopfinity"
    }
    spec = {
      podSelector = {
        matchLabels = {
          app = "backend"
        }
      }
      policyTypes = ["Ingress"]
      ingress = [
        {
          from = [
            {
              podSelector = {
                matchLabels = {
                  app = "frontend"
                }
              }
            },
            {
              namespaceSelector = {
                matchLabels = {
                  name = "ingress-nginx"
                }
              }
            }
          ]
          ports = [
            {
              protocol = "TCP"
              port     = 5000
            }
          ]
        }
      ]
    }
  }
}

# Service Account for Shopfinity backend
resource "kubernetes_service_account" "shopfinity_backend" {
  depends_on = [module.eks, kubernetes_namespace.shopfinity]
  
  metadata {
    name      = "shopfinity-backend"
    namespace = "shopfinity"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.shopfinity_app.arn
    }
  }
}

# RBAC for Shopfinity application
resource "kubernetes_role" "shopfinity_app" {
  depends_on = [module.eks, kubernetes_namespace.shopfinity]
  
  metadata {
    namespace = "shopfinity"
    name      = "shopfinity-app"
  }

  rule {
    api_groups = [""]
    resources  = ["secrets", "configmaps"]
    verbs      = ["get", "list"]
  }

  rule {
    api_groups = [""]
    resources  = ["pods"]
    verbs      = ["get", "list", "watch"]
  }
}

resource "kubernetes_role_binding" "shopfinity_app" {
  depends_on = [module.eks, kubernetes_namespace.shopfinity]
  
  metadata {
    name      = "shopfinity-app"
    namespace = "shopfinity"
  }
  
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "Role"
    name      = kubernetes_role.shopfinity_app.metadata[0].name
  }
  
  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.shopfinity_backend.metadata[0].name
    namespace = "shopfinity"
  }
}

# Additional security variables
variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "stripe_publishable_key" {
  description = "Stripe publishable key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "smtp_password" {
  description = "SMTP password for email notifications"
  type        = string
  default     = ""
  sensitive   = true
}