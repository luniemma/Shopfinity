# Database Configuration for Shopfinity
# RDS PostgreSQL, DocumentDB (MongoDB), and ElastiCache (Redis)

# RDS Subnet Group
resource "aws_db_subnet_group" "shopfinity" {
  count = var.enable_rds ? 1 : 0
  
  name       = "${local.cluster_name}-db-subnet-group"
  subnet_ids = module.vpc.database_subnets

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-db-subnet-group"
  })
}

# RDS Security Group
resource "aws_security_group" "rds" {
  count = var.enable_rds ? 1 : 0
  
  name_prefix = "${local.cluster_name}-rds"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [module.eks.cluster_security_group_id]
    description     = "PostgreSQL from EKS cluster"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-rds-sg"
  })
}

# KMS key for RDS encryption
resource "aws_kms_key" "rds" {
  count = var.enable_rds ? 1 : 0
  
  description             = "KMS key for RDS encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-rds-kms"
  })
}

resource "aws_kms_alias" "rds" {
  count = var.enable_rds ? 1 : 0
  
  name          = "alias/${local.cluster_name}-rds"
  target_key_id = aws_kms_key.rds[0].key_id
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "shopfinity" {
  count = var.enable_rds ? 1 : 0
  
  identifier = "${local.cluster_name}-postgres"

  # Engine configuration
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.rds_instance_class

  # Database configuration
  db_name  = "shopfinity"
  username = "shopfinity"
  password = random_password.rds_password[0].result

  # Storage configuration
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id           = aws_kms_key.rds[0].arn

  # Network configuration
  db_subnet_group_name   = aws_db_subnet_group.shopfinity[0].name
  vpc_security_group_ids = [aws_security_group.rds[0].id]
  publicly_accessible    = false

  # Backup configuration
  backup_retention_period = var.environment == "prod" ? 30 : 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  # Monitoring
  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring[0].arn
  enabled_cloudwatch_logs_exports = ["postgresql"]

  # Performance Insights
  performance_insights_enabled = true
  performance_insights_retention_period = var.environment == "prod" ? 731 : 7

  # Security
  deletion_protection = var.environment == "prod" ? true : false
  skip_final_snapshot = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "${local.cluster_name}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-postgres"
  })
}

# RDS Monitoring Role
resource "aws_iam_role" "rds_monitoring" {
  count = var.enable_rds ? 1 : 0
  
  name = "${local.cluster_name}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count = var.enable_rds ? 1 : 0
  
  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# Random password for RDS
resource "random_password" "rds_password" {
  count = var.enable_rds ? 1 : 0
  
  length  = 16
  special = true
}

# Store RDS password in AWS Secrets Manager
resource "aws_secretsmanager_secret" "rds_password" {
  count = var.enable_rds ? 1 : 0
  
  name                    = "${local.cluster_name}-rds-password"
  description             = "RDS password for Shopfinity"
  recovery_window_in_days = 7

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "rds_password" {
  count = var.enable_rds ? 1 : 0
  
  secret_id = aws_secretsmanager_secret.rds_password[0].id
  secret_string = jsonencode({
    username = aws_db_instance.shopfinity[0].username
    password = random_password.rds_password[0].result
    endpoint = aws_db_instance.shopfinity[0].endpoint
    port     = aws_db_instance.shopfinity[0].port
    dbname   = aws_db_instance.shopfinity[0].db_name
  })
}

# DocumentDB Subnet Group
resource "aws_docdb_subnet_group" "shopfinity" {
  count = var.enable_documentdb ? 1 : 0
  
  name       = "${local.cluster_name}-docdb-subnet-group"
  subnet_ids = module.vpc.database_subnets

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-docdb-subnet-group"
  })
}

# DocumentDB Security Group
resource "aws_security_group" "documentdb" {
  count = var.enable_documentdb ? 1 : 0
  
  name_prefix = "${local.cluster_name}-docdb"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 27017
    to_port         = 27017
    protocol        = "tcp"
    security_groups = [module.eks.cluster_security_group_id]
    description     = "MongoDB from EKS cluster"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-docdb-sg"
  })
}

# DocumentDB Cluster
resource "aws_docdb_cluster" "shopfinity" {
  count = var.enable_documentdb ? 1 : 0
  
  cluster_identifier      = "${local.cluster_name}-docdb"
  engine                 = "docdb"
  master_username        = "shopfinity"
  master_password        = random_password.documentdb_password[0].result
  backup_retention_period = var.environment == "prod" ? 30 : 7
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot    = var.environment != "prod"
  
  db_subnet_group_name   = aws_docdb_subnet_group.shopfinity[0].name
  vpc_security_group_ids = [aws_security_group.documentdb[0].id]
  
  storage_encrypted = true
  kms_key_id       = aws_kms_key.documentdb[0].arn
  
  enabled_cloudwatch_logs_exports = ["audit", "profiler"]

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-docdb"
  })
}

# DocumentDB Instances
resource "aws_docdb_cluster_instance" "shopfinity" {
  count = var.enable_documentdb ? (var.environment == "prod" ? 2 : 1) : 0
  
  identifier         = "${local.cluster_name}-docdb-${count.index}"
  cluster_identifier = aws_docdb_cluster.shopfinity[0].id
  instance_class     = var.documentdb_instance_class

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-docdb-${count.index}"
  })
}

# KMS key for DocumentDB
resource "aws_kms_key" "documentdb" {
  count = var.enable_documentdb ? 1 : 0
  
  description             = "KMS key for DocumentDB encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-docdb-kms"
  })
}

# Random password for DocumentDB
resource "random_password" "documentdb_password" {
  count = var.enable_documentdb ? 1 : 0
  
  length  = 16
  special = true
}

# ElastiCache Subnet Group
resource "aws_elasticache_subnet_group" "shopfinity" {
  count = var.enable_elasticache ? 1 : 0
  
  name       = "${local.cluster_name}-cache-subnet"
  subnet_ids = module.vpc.database_subnets

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-cache-subnet"
  })
}

# ElastiCache Security Group
resource "aws_security_group" "elasticache" {
  count = var.enable_elasticache ? 1 : 0
  
  name_prefix = "${local.cluster_name}-cache"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [module.eks.cluster_security_group_id]
    description     = "Redis from EKS cluster"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-cache-sg"
  })
}

# ElastiCache Redis Cluster
resource "aws_elasticache_replication_group" "shopfinity" {
  count = var.enable_elasticache ? 1 : 0
  
  replication_group_id       = "${local.cluster_name}-redis"
  description                = "Redis cluster for Shopfinity"
  
  node_type                  = var.elasticache_node_type
  port                       = 6379
  parameter_group_name       = aws_elasticache_parameter_group.shopfinity[0].name
  
  num_cache_clusters         = var.environment == "prod" ? 2 : 1
  automatic_failover_enabled = var.environment == "prod" ? true : false
  multi_az_enabled          = var.environment == "prod" ? true : false
  
  subnet_group_name = aws_elasticache_subnet_group.shopfinity[0].name
  security_group_ids = [aws_security_group.elasticache[0].id]
  
  # Encryption
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                = random_password.redis_password[0].result
  
  # Backup
  snapshot_retention_limit = var.environment == "prod" ? 7 : 1
  snapshot_window         = "03:00-05:00"
  
  # Maintenance
  maintenance_window = "sun:05:00-sun:07:00"
  
  # Logging
  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.elasticache[0].name
    destination_type = "cloudwatch-logs"
    log_format       = "text"
    log_type         = "slow-log"
  }

  tags = merge(local.common_tags, {
    Name = "${local.cluster_name}-redis"
  })
}

# ElastiCache Parameter Group
resource "aws_elasticache_parameter_group" "shopfinity" {
  count = var.enable_elasticache ? 1 : 0
  
  family = "redis7.x"
  name   = "${local.cluster_name}-redis-params"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  parameter {
    name  = "timeout"
    value = "300"
  }

  tags = local.common_tags
}

# Random password for Redis
resource "random_password" "redis_password" {
  count = var.enable_elasticache ? 1 : 0
  
  length  = 16
  special = false # Redis auth token cannot contain special characters
}

# CloudWatch Log Group for ElastiCache
resource "aws_cloudwatch_log_group" "elasticache" {
  count = var.enable_elasticache ? 1 : 0
  
  name              = "/aws/elasticache/${local.cluster_name}"
  retention_in_days = 30

  tags = local.common_tags