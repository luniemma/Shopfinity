# Optional: S3 Backend Setup for Terraform State
# Create this file separately if you want remote state management

# Uncomment and customize this configuration for remote state
# terraform {
#   backend "s3" {
#     bucket         = "your-terraform-state-bucket"
#     key            = "shopfinity/eks/terraform.tfstate"
#     region         = "us-west-2"
#     encrypt        = true
#     
#     # Optional: DynamoDB table for state locking
#     dynamodb_table = "terraform-state-locks"
#   }
# }

# Resources to create the S3 bucket and DynamoDB table for remote state
# Run this first with local state, then uncomment the backend above

resource "aws_s3_bucket" "terraform_state" {
  bucket = "shopfinity-terraform-state-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "Terraform State Bucket"
    Environment = "all"
    Purpose     = "terraform-state"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name           = "terraform-state-locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "Terraform State Locks"
    Environment = "all"
    Purpose     = "terraform-locks"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Output the bucket name for backend configuration
output "terraform_state_bucket" {
  description = "S3 bucket name for Terraform state"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "terraform_locks_table" {
  description = "DynamoDB table name for Terraform locks"
  value       = aws_dynamodb_table.terraform_locks.name
}