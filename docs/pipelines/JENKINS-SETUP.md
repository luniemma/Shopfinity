# 🏗️ Jenkins Pipeline Setup Guide

Complete setup guide for the Shopfinity Jenkins CI/CD pipeline.

## 📋 Prerequisites

- Jenkins server (2.400+)
- Docker installed on Jenkins agents
- Kubernetes cluster access
- Container registry (Docker Hub, ACR, ECR, etc.)
- Slack workspace (optional, for notifications)

## 🔧 Jenkins Configuration

### 1. **Required Plugins**

Install these plugins via **Manage Jenkins > Manage Plugins**:

#### Essential Plugins
```bash
# Core Pipeline Plugins
- Pipeline
- Pipeline: Stage View
- Pipeline: Groovy
- Blue Ocean (recommended for UI)

# SCM Plugins
- Git
- GitHub
- GitHub Branch Source

# Build Tools
- NodeJS
- Docker Pipeline
- Docker

# Testing & Quality
- JUnit
- Coverage
- HTML Publisher

# Deployment
- Kubernetes
- Kubernetes CLI
- Kubernetes Credentials

# Notifications
- Slack Notification
- Email Extension
- HTTP Request

# Utilities
- Build Timeout
- Timestamper
- AnsiColor
- Workspace Cleanup
```

#### Optional but Recommended
```bash
- Blue Ocean
- Pipeline: Build Step
- Pipeline: Input Step
- Pipeline: Milestone Step
- Lockable Resources
- Build Monitor View
```

### 2. **Global Tool Configuration**

Configure tools in **Manage Jenkins > Global Tool Configuration**:

#### Node.js Installation
```bash
# Add NodeJS installation
Name: NodeJS-18
Version: 18.x (latest LTS)
Global npm packages: @lhci/cli@0.12.x
```

#### Docker Installation
```bash
# Add Docker installation
Name: Docker
Install automatically: Yes
Version: latest
```

#### Kubernetes CLI
```bash
# Add Kubernetes CLI
Name: kubectl
Install automatically: Yes
Version: 1.28.0 (or latest stable)
```

### 3. **Credentials Configuration**

Add credentials in **Manage Jenkins > Manage Credentials**:

#### Docker Registry Credentials
```bash
# Kind: Username with password
ID: docker-registry-credentials
Username: your-registry-username
Password: your-registry-password
Description: Docker Registry Credentials
```

#### Kubernetes Configuration
```bash
# Kind: Secret file
ID: kubeconfig
File: Upload your kubeconfig file
Description: Kubernetes Configuration
```

#### Container Registry URL
```bash
# Kind: Secret text
ID: docker-registry-url
Secret: your-registry-url (e.g., docker.io, myregistry.azurecr.io)
Description: Docker Registry URL
```

#### Slack Webhook (Optional)
```bash
# Kind: Secret text
ID: slack-webhook-url
Secret: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
Description: Slack Webhook URL
```

### 4. **System Configuration**

Configure system settings in **Manage Jenkins > Configure System**:

#### Global Properties
```bash
# Environment variables
DOCKER_BUILDKIT: 1
COMPOSE_DOCKER_CLI_BUILD: 1
```

#### Slack Configuration (Optional)
```bash
# Slack settings
Workspace: your-workspace
Default channel: #deployments
Integration token: Add from credentials
```

#### Email Configuration
```bash
# Extended E-mail Notification
SMTP server: your-smtp-server
Default user e-mail suffix: @yourcompany.com
```

## 🚀 Pipeline Setup

### 1. **Create Multibranch Pipeline**

#### Step 1: Create New Item
```bash
# Go to Jenkins Dashboard > New Item
# Enter name: shopfinity-pipeline
# Select: Multibranch Pipeline
# Click OK
```

#### Step 2: Configure Branch Sources
```bash
# Branch Sources section:
# Add source: Git or GitHub
# Repository URL: https://github.com/your-org/shopfinity.git
# Credentials: Add your Git credentials
```

#### Step 3: Build Configuration
```bash
# Build Configuration:
# Mode: by Jenkinsfile
# Script Path: Jenkinsfile
```

#### Step 4: Scan Multibranch Pipeline Triggers
```bash
# Scan Repository Triggers:
# Check: Periodically if not otherwise run
# Interval: 5 minutes
```

#### Step 5: Orphaned Item Strategy
```bash
# Orphaned Item Strategy:
# Discard old items: Yes
# Days to keep old items: 7
# Max # of old items to keep: 10
```

### 2. **Configure Pipeline Libraries (Optional)**

Create shared libraries for reusable pipeline code:

#### Step 1: Create Shared Library Repository
```groovy
// vars/deployToKubernetes.groovy
def call(Map config) {
    script {
        withKubeConfig([credentialsId: 'kubeconfig']) {
            sh """
                kubectl apply -f ${config.manifests}
                kubectl rollout status deployment/${config.deployment} -n ${config.namespace} --timeout=300s
            """
        }
    }
}
```

#### Step 2: Configure in Jenkins
```bash
# Go to Manage Jenkins > Configure System
# Global Pipeline Libraries section:
# Name: shopfinity-pipeline-lib
# Default version: main
# Retrieval method: Modern SCM
# Source Code Management: Git
# Repository URL: https://github.com/your-org/jenkins-pipeline-lib.git
```

### 3. **Agent Configuration**

#### Option 1: Use Built-in Node
```bash
# Configure built-in node
# Go to Manage Jenkins > Manage Nodes and Clouds > Built-In Node > Configure
# Labels: master docker kubernetes
# Usage: Use this node as much as possible
```

#### Option 2: Add Docker Agents
```bash
# Go to Manage Jenkins > Manage Nodes and Clouds > New Node
# Node name: docker-agent-1
# Type: Permanent Agent
# Remote root directory: /home/jenkins
# Labels: docker linux
# Launch method: Launch agent via SSH
```

#### Option 3: Kubernetes Agents (Recommended)
```yaml
# Add to Jenkinsfile for dynamic agents
pipeline {
    agent {
        kubernetes {
            yaml """
                apiVersion: v1
                kind: Pod
                spec:
                  containers:
                  - name: docker
                    image: docker:dind
                    securityContext:
                      privileged: true
                  - name: kubectl
                    image: bitnami/kubectl:latest
                    command:
                    - sleep
                    args:
                    - 99d
            """
        }
    }
    // ... rest of pipeline
}
```

## 🔒 Security Configuration

### 1. **Role-Based Access Control**

Install and configure **Role-based Authorization Strategy**:

#### Create Roles
```bash
# Go to Manage Jenkins > Manage and Assign Roles > Manage Roles
# Global roles:
```
- **admin**: Overall/Administer
- **developer**: Overall/Read, Job/Build, Job/Cancel, Job/Read
- **viewer**: Overall/Read, Job/Read

#### Assign Roles
```bash
# Go to Manage Jenkins > Manage and Assign Roles > Assign Roles
# Assign users to appropriate roles
```

### 2. **Security Hardening**

#### Configure Security Realm
```bash
# Go to Manage Jenkins > Configure Global Security
# Security Realm: Jenkins' own user database
# Authorization: Role-Based Strategy
# Prevent Cross Site Request Forgery exploits: Enable
```

#### Agent Security
```bash
# Agents section:
# TCP port for inbound agents: Fixed (50000)
# Agent protocols: Only JNLP4-connect
```

### 3. **Credential Security**

#### Best Practices
```bash
# Use credential binding in pipelines
withCredentials([
    usernamePassword(credentialsId: 'docker-registry-credentials', 
                     usernameVariable: 'DOCKER_USER', 
                     passwordVariable: 'DOCKER_PASS')
]) {
    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
}
```

## 📊 Monitoring and Maintenance

### 1. **Build Monitoring**

#### Install Monitoring Plugins
```bash
# Recommended monitoring plugins:
- Build Monitor View
- Build Pipeline Plugin
- Radiator View Plugin
- Monitoring
```

#### Create Dashboard Views
```bash
# Go to Jenkins Dashboard > New View
# View name: Shopfinity Dashboard
# Type: Build Monitor View
# Select jobs: shopfinity-pipeline
```

### 2. **Log Management**

#### Configure Log Rotation
```bash
# Go to Manage Jenkins > Configure System
# Log Recorders section:
# Add new log recorder: Pipeline Logs
# Loggers: org.jenkinsci.plugins.workflow
# Log level: INFO
```

#### Archive Build Logs
```groovy
// Add to Jenkinsfile
post {
    always {
        archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true
    }
}
```

### 3. **Performance Optimization**

#### Build Performance
```bash
# Optimize build performance:
1. Use build caches
2. Parallel stage execution
3. Appropriate agent sizing
4. Clean workspace management
```

#### Resource Management
```groovy
// Configure resource limits
pipeline {
    options {
        timeout(time: 60, unit: 'MINUTES')
        retry(2)
        skipDefaultCheckout()
    }
}
```

## 🔧 Troubleshooting

### 1. **Common Issues**

#### Issue: Pipeline Fails to Start
```bash
# Solutions:
1. Check Jenkinsfile syntax
2. Verify agent availability
3. Check plugin compatibility
4. Review Jenkins logs
```

#### Issue: Docker Commands Fail
```bash
# Solutions:
1. Ensure Docker is installed on agent
2. Check Docker daemon status
3. Verify user permissions for Docker
4. Use Docker-in-Docker if needed
```

#### Issue: Kubernetes Deployment Fails
```bash
# Solutions:
1. Verify kubeconfig credentials
2. Check cluster connectivity
3. Review RBAC permissions
4. Validate Kubernetes manifests
```

#### Issue: Tests Fail in Pipeline
```bash
# Solutions:
1. Check test dependencies
2. Verify environment variables
3. Review service connectivity
4. Check timing issues
```

### 2. **Debug Commands**

#### Pipeline Debugging
```groovy
// Add debug steps to Jenkinsfile
script {
    echo "Current workspace: ${env.WORKSPACE}"
    echo "Build number: ${env.BUILD_NUMBER}"
    echo "Branch name: ${env.BRANCH_NAME}"
    sh 'env | sort'
}
```

#### Docker Debugging
```groovy
// Debug Docker issues
script {
    sh 'docker version'
    sh 'docker info'
    sh 'docker ps -a'
    sh 'docker images'
}
```

#### Kubernetes Debugging
```groovy
// Debug Kubernetes issues
script {
    sh 'kubectl version --client'
    sh 'kubectl cluster-info'
    sh 'kubectl get nodes'
    sh 'kubectl get pods -n shopfinity'
}
```

## 🚀 Advanced Features

### 1. **Blue-Green Deployments**

```groovy
// Implement blue-green deployment
stage('Blue-Green Deploy') {
    steps {
        script {
            def currentColor = sh(
                script: "kubectl get service shopfinity-service -n shopfinity -o jsonpath='{.spec.selector.version}'",
                returnStdout: true
            ).trim()
            
            def newColor = currentColor == 'blue' ? 'green' : 'blue'
            
            // Deploy to new color
            sh "kubectl set image deployment/shopfinity-${newColor} app=${BACKEND_IMAGE} -n shopfinity"
            sh "kubectl rollout status deployment/shopfinity-${newColor} -n shopfinity"
            
            // Switch traffic
            sh "kubectl patch service shopfinity-service -n shopfinity -p '{\"spec\":{\"selector\":{\"version\":\"${newColor}\"}}}'"
        }
    }
}
```

### 2. **Canary Deployments**

```groovy
// Implement canary deployment
stage('Canary Deploy') {
    steps {
        script {
            // Deploy canary version (10% traffic)
            sh "kubectl apply -f k8s/canary/"
            
            // Wait and monitor
            sleep(time: 300, unit: 'SECONDS')
            
            // Check metrics and decide
            def errorRate = sh(
                script: "kubectl exec -n monitoring prometheus-0 -- promtool query instant 'rate(http_requests_total{status=~\"5..\"}[5m])'",
                returnStdout: true
            ).trim()
            
            if (errorRate.toFloat() > 0.01) {
                error("Canary deployment failed - high error rate")
            }
            
            // Promote canary to full deployment
            sh "kubectl apply -f k8s/production/"
        }
    }
}
```

### 3. **Integration with External Tools**

#### SonarQube Integration
```groovy
stage('Code Quality') {
    steps {
        withSonarQubeEnv('SonarQube') {
            sh 'npm run sonar-scanner'
        }
        
        timeout(time: 10, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
        }
    }
}
```

#### Jira Integration
```groovy
// Update Jira tickets
post {
    success {
        script {
            def issueKeys = sh(
                script: "git log --oneline ${env.GIT_PREVIOUS_COMMIT}..${env.GIT_COMMIT} | grep -o '[A-Z]\\+-[0-9]\\+' | sort -u",
                returnStdout: true
            ).trim().split('\n')
            
            issueKeys.each { issueKey ->
                jiraTransitionIssue idOrKey: issueKey, input: [transition: [id: '31']]
            }
        }
    }
}
```

## 📚 Additional Resources

### Documentation
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Plugin Index](https://plugins.jenkins.io/)
- [Best Practices](https://www.jenkins.io/doc/book/pipeline/pipeline-best-practices/)

### Community Resources
- [Jenkins Community](https://www.jenkins.io/participate/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/jenkins)
- [Jenkins Users Google Group](https://groups.google.com/g/jenkinsci-users)

### Training and Certification
- [Jenkins Certification](https://www.cloudbees.com/jenkins/certification)
- [Pipeline Examples](https://github.com/jenkinsci/pipeline-examples)

---

🎉 **Your Jenkins pipeline is now ready for enterprise-grade CI/CD!**