# Monitoring and Observability Configuration
# Prometheus, Grafana, CloudWatch, and logging setup

# Prometheus and Grafana using kube-prometheus-stack
resource "helm_release" "kube_prometheus_stack" {
  name       = "kube-prometheus-stack"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = "monitoring"
  version    = "51.2.0"

  create_namespace = true

  values = [
    yamlencode({
      # Prometheus configuration
      prometheus = {
        prometheusSpec = {
          retention = "30d"
          storageSpec = {
            volumeClaimTemplate = {
              spec = {
                storageClassName = "gp3"
                accessModes      = ["ReadWriteOnce"]
                resources = {
                  requests = {
                    storage = "50Gi"
                  }
                }
              }
            }
          }
          resources = {
            requests = {
              memory = "2Gi"
              cpu    = "1000m"
            }
            limits = {
              memory = "4Gi"
              cpu    = "2000m"
            }
          }
        }
        
        service = {
          type = "ClusterIP"
        }
        
        ingress = {
          enabled = true
          ingressClassName = "nginx"
          hosts = ["prometheus.${var.environment}.shopfinity.local"]
          tls = [
            {
              secretName = "prometheus-tls"
              hosts      = ["prometheus.${var.environment}.shopfinity.local"]
            }
          ]
        }
      }
      
      # Grafana configuration
      grafana = {
        adminPassword = random_password.grafana_password.result
        
        persistence = {
          enabled = true
          storageClassName = "gp3"
          size = "10Gi"
        }
        
        resources = {
          requests = {
            memory = "512Mi"
            cpu    = "250m"
          }
          limits = {
            memory = "1Gi"
            cpu    = "500m"
          }
        }
        
        service = {
          type = "ClusterIP"
        }
        
        ingress = {
          enabled = true
          ingressClassName = "nginx"
          hosts = ["grafana.${var.environment}.shopfinity.local"]
          tls = [
            {
              secretName = "grafana-tls"
              hosts      = ["grafana.${var.environment}.shopfinity.local"]
            }
          ]
        }
        
        # Pre-configured dashboards
        dashboardProviders = {
          "dashboardproviders.yaml" = {
            apiVersion = 1
            providers = [
              {
                name = "default"
                orgId = 1
                folder = ""
                type = "file"
                disableDeletion = false
                editable = true
                options = {
                  path = "/var/lib/grafana/dashboards/default"
                }
              }
            ]
          }
        }
        
        dashboards = {
          default = {
            kubernetes-cluster-monitoring = {
              gnetId = 7249
              revision = 1
              datasource = "Prometheus"
            }
            kubernetes-pod-monitoring = {
              gnetId = 6417
              revision = 1
              datasource = "Prometheus"
            }
            nginx-ingress-controller = {
              gnetId = 9614
              revision = 1
              datasource = "Prometheus"
            }
          }
        }
      }
      
      # AlertManager configuration
      alertmanager = {
        alertmanagerSpec = {
          storage = {
            volumeClaimTemplate = {
              spec = {
                storageClassName = "gp3"
                accessModes      = ["ReadWriteOnce"]
                resources = {
                  requests = {
                    storage = "10Gi"
                  }
                }
              }
            }
          }
          
          resources = {
            requests = {
              memory = "256Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "512Mi"
              cpu    = "200m"
            }
          }
        }
        
        config = {
          global = {
            slack_api_url = var.slack_webhook_url
          }
          
          route = {
            group_by = ["alertname"]
            group_wait = "10s"
            group_interval = "10s"
            repeat_interval = "1h"
            receiver = "web.hook"
          }
          
          receivers = [
            {
              name = "web.hook"
              slack_configs = [
                {
                  channel = "#alerts"
                  title = "Shopfinity Alert"
                  text = "{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}"
                }
              ]
            }
          ]
        }
      }
      
      # Node Exporter
      nodeExporter = {
        enabled = true
      }
      
      # Kube State Metrics
      kubeStateMetrics = {
        enabled = true
      }
    })
  ]

  depends_on = [module.eks, helm_release.nginx_ingress]
}

# Random password for Grafana
resource "random_password" "grafana_password" {
  length  = 16
  special = true
}

# Store Grafana password in Kubernetes secret
resource "kubernetes_secret" "grafana_credentials" {
  depends_on = [module.eks]
  
  metadata {
    name      = "grafana-credentials"
    namespace = "monitoring"
  }

  data = {
    admin-user     = "admin"
    admin-password = random_password.grafana_password.result
  }

  type = "Opaque"
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "eks_cluster" {
  name              = "/aws/eks/${local.cluster_name}/cluster"
  retention_in_days = 30
  kms_key_id       = var.enable_cluster_encryption ? aws_kms_key.eks[0].arn : null

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "application_logs" {
  name              = "/aws/eks/${local.cluster_name}/application"
  retention_in_days = 14

  tags = local.common_tags
}

# Fluent Bit for log forwarding
resource "helm_release" "fluent_bit" {
  name       = "fluent-bit"
  repository = "https://fluent.github.io/helm-charts"
  chart      = "fluent-bit"
  namespace  = "amazon-cloudwatch"
  version    = "0.37.0"

  create_namespace = true

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = aws_iam_role.fluent_bit.arn
  }

  set {
    name  = "cloudWatchLogs.region"
    value = data.aws_region.current.name
  }

  set {
    name  = "cloudWatchLogs.logGroupName"
    value = aws_cloudwatch_log_group.application_logs.name
  }

  set {
    name  = "firehose.enabled"
    value = "false"
  }

  set {
    name  = "kinesis.enabled"
    value = "false"
  }

  depends_on = [module.eks]
}

# IAM role for Fluent Bit
resource "aws_iam_role" "fluent_bit" {
  name = "${local.cluster_name}-fluent-bit"

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
            "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:amazon-cloudwatch:fluent-bit"
            "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "fluent_bit" {
  name = "${local.cluster_name}-fluent-bit"
  role = aws_iam_role.fluent_bit.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
      }
    ]
  })
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${local.cluster_name}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors EKS cluster CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = module.eks.cluster_name
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "${local.cluster_name}-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "This metric monitors EKS cluster memory utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = module.eks.cluster_name
  }

  tags = local.common_tags
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "${local.cluster_name}-alerts"

  tags = local.common_tags
}

# SNS Topic Subscription (email)
resource "aws_sns_topic_subscription" "email_alerts" {
  count = var.alert_email != "" ? 1 : 0
  
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Additional monitoring variables
variable "slack_webhook_url" {
  description = "Slack webhook URL for alerts"
  type        = string
  default     = ""
  sensitive   = true
}

variable "alert_email" {
  description = "Email address for CloudWatch alerts"
  type        = string
  default     = ""
}