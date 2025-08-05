# 🚀 Azure DevOps Pipeline Setup Guide

Complete setup guide for the Shopfinity Azure DevOps CI/CD pipeline.

## 📋 Prerequisites

- Azure DevOps organization and project
- Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS) or other Kubernetes cluster
- Slack workspace (optional, for notifications)

## 🔧 Setup Instructions

### 1. **Create Service Connections**

#### Azure Container Registry Connection
```bash
# Go to Project Settings > Service connections > New service connection
# Select "Docker Registry"
# Choose "Azure Container Registry"
# Configure:
```
- **Connection name**: `shopfinity-acr`
- **Azure subscription**: Your subscription
- **Azure container registry**: Your ACR instance
- **Service connection name**: `shopfinity-acr`

#### Kubernetes Service Connection
```bash
# Go to Project Settings > Service connections > New service connection
# Select "Kubernetes"
# Choose "Service Account" or "Azure Subscription"
# Configure:
```
- **Connection name**: `shopfinity-k8s`
- **Server URL**: Your Kubernetes API server
- **Secret**: Service account token or kubeconfig

### 2. **Configure Variable Groups**

#### Create Variable Group: `shopfinity-variables`
```bash
# Go to Pipelines > Library > Variable groups > + Variable group
# Name: shopfinity-variables
```

**Variables to add:**
```yaml
# Container Registry
containerRegistry: 'shopfinityacr.azurecr.io'
dockerRegistryServiceConnection: 'shopfinity-acr'

# Kubernetes
kubernetesServiceConnection: 'shopfinity-k8s'
namespace: 'shopfinity'

# Notifications (optional)
SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/...' # Mark as secret
LHCI_GITHUB_APP_TOKEN: 'your-lighthouse-token' # Mark as secret
```

### 3. **Set Up Environments**

#### Staging Environment
```bash
# Go to Pipelines > Environments > New environment
# Name: staging
# Resource type: Kubernetes
# Configure:
```
- **Environment name**: `staging`
- **Description**: `Staging environment for Shopfinity`
- **Kubernetes resource**: Link to your staging cluster
- **Namespace**: `shopfinity-staging`

**Approval and Checks:**
- **Pre-deployment approvals**: 1 approver
- **Branch control**: `develop` branch only

#### Production Environment
```bash
# Go to Pipelines > Environments > New environment
# Name: production
# Resource type: Kubernetes
# Configure:
```
- **Environment name**: `production`
- **Description**: `Production environment for Shopfinity`
- **Kubernetes resource**: Link to your production cluster
- **Namespace**: `shopfinity`

**Approval and Checks:**
- **Pre-deployment approvals**: 2 approvers
- **Branch control**: `main` branch only
- **Wait timer**: 5 minutes

### 4. **Configure Branch Policies**

#### Main Branch Protection
```bash
# Go to Repos > Branches > main branch > Branch policies
# Configure:
```
- **Require a minimum number of reviewers**: 2
- **Check for linked work items**: Enabled
- **Check for comment resolution**: Enabled
- **Build validation**: Add build policy for `azure-pipelines.yml`

#### Develop Branch Protection
```bash
# Go to Repos > Branches > develop branch > Branch policies
# Configure:
```
- **Require a minimum number of reviewers**: 1
- **Build validation**: Add build policy for `azure-pipelines.yml`

### 5. **Create the Pipeline**

#### Method 1: YAML Pipeline (Recommended)
```bash
# Go to Pipelines > Pipelines > New pipeline
# Select: Azure Repos Git
# Select your repository
# Select: Existing Azure Pipelines YAML file
# Path: /azure-pipelines.yml
```

#### Method 2: Import from GitHub
```bash
# Go to Pipelines > Pipelines > New pipeline
# Select: GitHub
# Select your repository
# Select: Existing Azure Pipelines YAML file
# Path: /azure-pipelines.yml
```

### 6. **Configure Pipeline Settings**

#### Pipeline Permissions
```bash
# Go to your pipeline > Edit > More actions > Security
# Configure:
```
- **Pipeline permissions**: Contributor access to repositories
- **Resource authorization**: Authorize access to service connections
- **Environment permissions**: Access to staging and production environments

#### Pipeline Variables
```bash
# Go to your pipeline > Edit > Variables
# Link variable group: shopfinity-variables
```

### 7. **Set Up Notifications**

#### Slack Integration (Optional)
```bash
# Install Slack app in your workspace
# Create incoming webhook
# Add webhook URL to variable group as secret
```

#### Email Notifications
```bash
# Go to Project Settings > Notifications
# Configure notifications for:
```
- Build completion
- Build failure
- Release deployment completion
- Release deployment failure

## 🔒 Security Configuration

### 1. **Service Account Setup (Kubernetes)**

Create a service account for Azure DevOps:

```yaml
# k8s-service-account.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: azure-devops
  namespace: shopfinity
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: azure-devops-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: azure-devops
  namespace: shopfinity
---
apiVersion: v1
kind: Secret
metadata:
  name: azure-devops-token
  namespace: shopfinity
  annotations:
    kubernetes.io/service-account.name: azure-devops
type: kubernetes.io/service-account-token
```

Apply the configuration:
```bash
kubectl apply -f k8s-service-account.yaml

# Get the token
kubectl get secret azure-devops-token -n shopfinity -o jsonpath='{.data.token}' | base64 -d
```

### 2. **Container Registry Authentication**

Ensure your ACR has the correct permissions:
```bash
# Grant AcrPush role to the service principal
az role assignment create \
  --assignee <service-principal-id> \
  --role AcrPush \
  --scope /subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.ContainerRegistry/registries/<acr-name>
```

## 📊 Monitoring and Troubleshooting

### 1. **Pipeline Monitoring**

#### View Pipeline Analytics
```bash
# Go to Pipelines > Analytics
# Monitor:
```
- Build success rate
- Build duration trends
- Test pass rate
- Deployment frequency

#### Set Up Alerts
```bash
# Go to Project Settings > Service hooks
# Configure webhooks for:
```
- Build failures
- Long-running builds
- Test failures
- Deployment failures

### 2. **Common Issues and Solutions**

#### Issue: Service Connection Authentication Failed
```bash
# Solution:
1. Verify service principal credentials
2. Check Azure subscription permissions
3. Regenerate service principal secret if needed
```

#### Issue: Kubernetes Deployment Failed
```bash
# Solution:
1. Check service account permissions
2. Verify cluster connectivity
3. Check resource quotas and limits
4. Review Kubernetes manifests
```

#### Issue: Docker Build Failed
```bash
# Solution:
1. Check Dockerfile syntax
2. Verify base image availability
3. Check build context and .dockerignore
4. Review build logs for specific errors
```

#### Issue: Tests Failing in Pipeline
```bash
# Solution:
1. Check test service dependencies
2. Verify environment variables
3. Review test database connectivity
4. Check for timing issues in integration tests
```

### 3. **Performance Optimization**

#### Build Performance
```bash
# Optimize build times:
1. Use build caching for npm dependencies
2. Implement Docker layer caching
3. Run tests in parallel
4. Use smaller base images
```

#### Resource Management
```bash
# Optimize resource usage:
1. Configure appropriate agent pools
2. Set build timeouts
3. Clean up build artifacts
4. Monitor agent utilization
```

## 🚀 Advanced Configuration

### 1. **Multi-Stage Deployments**

Configure deployment slots or blue-green deployments:
```yaml
# Add to azure-pipelines.yml
- stage: BlueGreenDeploy
  jobs:
  - deployment: BlueSlot
    environment: production-blue
  - deployment: GreenSlot
    environment: production-green
```

### 2. **Feature Flag Integration**

Integrate with Azure App Configuration:
```yaml
# Add feature flag checks
- script: |
    # Check feature flags before deployment
    az appconfig feature show --name MyFeatureFlag
```

### 3. **Database Migrations**

Add database migration steps:
```yaml
- script: |
    # Run database migrations
    kubectl apply -f k8s/jobs/migration-job.yaml
    kubectl wait --for=condition=complete job/db-migration -n shopfinity --timeout=300s
```

## 📚 Additional Resources

### Documentation Links
- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)
- [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/)
- [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/)
- [YAML Schema Reference](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema)

### Best Practices
- Use variable groups for environment-specific configurations
- Implement proper secret management
- Set up comprehensive monitoring and alerting
- Use infrastructure as code for reproducible deployments
- Implement proper testing strategies at each stage

### Support
- **Azure DevOps Community**: [Developer Community](https://developercommunity.visualstudio.com/spaces/21/index.html)
- **Documentation**: [Azure DevOps Docs](https://docs.microsoft.com/en-us/azure/devops/)
- **Stack Overflow**: Tag questions with `azure-devops`

---

🎉 **Your Azure DevOps pipeline is now ready for enterprise-grade CI/CD!**