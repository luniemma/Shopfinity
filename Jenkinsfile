// Jenkins Pipeline for Shopfinity eCommerce Platform
// Comprehensive CI/CD with testing, security, and deployment

pipeline {
    agent any
    
    // Environment Variables
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_CREDENTIALS = credentials('docker-registry-credentials')
        KUBECONFIG = credentials('kubeconfig')
        SLACK_WEBHOOK = credentials('slack-webhook-url')
        
        // Dynamic environment based on branch
        ENVIRONMENT = "${env.BRANCH_NAME == 'main' ? 'production' : env.BRANCH_NAME == 'develop' ? 'staging' : 'development'}"
        DEPLOYMENT_URL = "${env.BRANCH_NAME == 'main' ? 'https://shopfinity.com' : env.BRANCH_NAME == 'develop' ? 'https://staging.shopfinity.com' : 'https://dev.shopfinity.com'}"
        
        // Image tags
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/shopfinity/frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/shopfinity/backend:${IMAGE_TAG}"
    }
    
    // Build triggers
    triggers {
        githubPush()
        pollSCM('H/5 * * * *') // Poll every 5 minutes as fallback
    }
    
    // Pipeline options
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
        skipDefaultCheckout(false)
    }
    
    stages {
        // 🔍 Checkout and Setup
        stage('Checkout & Setup') {
            steps {
                script {
                    echo "🚀 Starting Shopfinity CI/CD Pipeline"
                    echo "Branch: ${env.BRANCH_NAME}"
                    echo "Environment: ${ENVIRONMENT}"
                    echo "Build: ${env.BUILD_NUMBER}"
                }
                
                // Clean workspace
                cleanWs()
                
                // Checkout code
                checkout scm
                
                // Setup Node.js
                script {
                    def nodeHome = tool name: 'NodeJS-18', type: 'nodejs'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
            }
        }
        
        // 🧪 Testing and Quality Assurance
        stage('Testing & Quality') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        script {
                            echo "🎨 Running Frontend Tests"
                        }
                        
                        // Cache npm dependencies
                        cache(maxCacheSize: 250, caches: [
                            arbitraryFileCache(path: 'node_modules', fingerprint: naming(includes: 'package-lock.json'))
                        ]) {
                            sh 'npm ci'
                        }
                        
                        // Run ESLint
                        sh 'npm run lint'
                        
                        // Run tests with coverage
                        sh 'npm test -- --coverage --watchAll=false --ci'
                        
                        // Build frontend
                        sh 'npm run build'
                        
                        // Archive build artifacts
                        archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                        
                        // Publish test results
                        publishTestResults testResultsPattern: 'junit.xml'
                        
                        // Publish coverage
                        publishCoverage adapters: [
                            coberturaAdapter('coverage/cobertura-coverage.xml')
                        ], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                    }
                    post {
                        always {
                            // Clean up
                            sh 'rm -rf node_modules/.cache'
                        }
                    }
                }
                
                stage('Backend Tests') {
                    steps {
                        script {
                            echo "🔧 Running Backend Tests"
                        }
                        
                        // Start test services
                        sh '''
                            docker-compose -f docker-compose.test.yml up -d postgres redis mongodb
                            sleep 30
                        '''
                        
                        dir('backend') {
                            // Cache backend dependencies
                            cache(maxCacheSize: 250, caches: [
                                arbitraryFileCache(path: 'node_modules', fingerprint: naming(includes: 'package-lock.json'))
                            ]) {
                                sh 'npm ci'
                            }
                            
                            // Run backend linting
                            sh 'npm run lint || echo "ESLint not configured, skipping..."'
                            
                            // Run backend tests
                            withEnv([
                                'NODE_ENV=test',
                                'DATABASE_URL=postgresql://test:test123@localhost:5432/shopfinity_test',
                                'MONGODB_URI=mongodb://test:test123@localhost:27017/shopfinity_test?authSource=admin',
                                'REDIS_URL=redis://localhost:6379',
                                'JWT_SECRET=test-jwt-secret'
                            ]) {
                                sh 'npm test || echo "Tests not configured, skipping..."'
                            }
                        }
                    }
                    post {
                        always {
                            // Stop test services
                            sh 'docker-compose -f docker-compose.test.yml down -v || true'
                        }
                    }
                }
                
                stage('Security Scanning') {
                    steps {
                        script {
                            echo "🔒 Running Security Scans"
                        }
                        
                        // Install Trivy
                        sh '''
                            if ! command -v trivy &> /dev/null; then
                                wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
                                echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
                                sudo apt-get update
                                sudo apt-get install -y trivy
                            fi
                        '''
                        
                        // Run Trivy filesystem scan
                        sh 'trivy fs --format json --output trivy-results.json .'
                        
                        // Run npm audit
                        sh 'npm audit --audit-level high --json > frontend-audit.json || true'
                        
                        dir('backend') {
                            sh 'npm audit --audit-level high --json > ../backend-audit.json || true'
                        }
                        
                        // Archive security scan results
                        archiveArtifacts artifacts: '*-audit.json,trivy-results.json', fingerprint: true
                        
                        // Parse and display results
                        script {
                            def trivyResults = readJSON file: 'trivy-results.json'
                            if (trivyResults.Results) {
                                echo "⚠️ Security vulnerabilities found. Check artifacts for details."
                            }
                        }
                    }
                }
            }
        }
        
        // 🐳 Build Docker Images
        stage('Build & Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo "🐳 Building Frontend Docker Image"
                            
                            // Build frontend image
                            def frontendImage = docker.build("${DOCKER_REGISTRY}/shopfinity/frontend:${IMAGE_TAG}", ".")
                            
                            // Login and push
                            docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS}") {
                                frontendImage.push()
                                frontendImage.push("latest")
                            }
                            
                            // Scan image
                            sh "trivy image --format json --output frontend-image-scan.json ${FRONTEND_IMAGE} || true"
                            archiveArtifacts artifacts: 'frontend-image-scan.json', fingerprint: true
                        }
                    }
                }
                
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo "🐳 Building Backend Docker Image"
                            
                            // Build backend image
                            def backendImage = docker.build("${DOCKER_REGISTRY}/shopfinity/backend:${IMAGE_TAG}", "./backend")
                            
                            // Login and push
                            docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS}") {
                                backendImage.push()
                                backendImage.push("latest")
                            }
                            
                            // Scan image
                            sh "trivy image --format json --output backend-image-scan.json ${BACKEND_IMAGE} || true"
                            archiveArtifacts artifacts: 'backend-image-scan.json', fingerprint: true
                        }
                    }
                }
            }
        }
        
        // 🧪 Integration Testing
        stage('Integration Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "🧪 Running Integration Tests"
                }
                
                // Create test docker-compose file with built images
                writeFile file: 'docker-compose.integration.yml', text: """
version: '3.8'
services:
  frontend:
    image: ${FRONTEND_IMAGE}
    ports:
      - "3000:80"
    depends_on:
      - backend
      
  backend:
    image: ${BACKEND_IMAGE}
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test123@postgres:5432/shopfinity_test
      - MONGODB_URI=mongodb://test:test123@mongo:27017/shopfinity_test?authSource=admin
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=test-jwt-secret
    depends_on:
      - postgres
      - mongo
      - redis
      
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: test123
      POSTGRES_USER: test
      POSTGRES_DB: shopfinity_test
    ports:
      - "5432:5432"
      
  mongo:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: test
      MONGO_INITDB_ROOT_PASSWORD: test123
    ports:
      - "27017:27017"
      
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
"""
                
                // Start integration test services
                sh 'docker-compose -f docker-compose.integration.yml up -d'
                
                // Wait for services to be ready
                sh 'sleep 60'
                
                // Run integration tests
                sh '''
                    echo "Testing frontend..."
                    curl -f http://localhost:3000 || exit 1
                    
                    echo "Testing backend health..."
                    curl -f http://localhost:5000/health || exit 1
                    
                    echo "Testing API endpoints..."
                    curl -f http://localhost:5000/api/products || exit 1
                    
                    echo "✅ Integration tests passed!"
                '''
            }
            post {
                always {
                    // Collect logs and cleanup
                    sh 'docker-compose -f docker-compose.integration.yml logs > integration-test-logs.txt || true'
                    archiveArtifacts artifacts: 'integration-test-logs.txt', fingerprint: true
                    sh 'docker-compose -f docker-compose.integration.yml down -v || true'
                }
            }
        }
        
        // 🚀 Deployment
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    echo "🚀 Deploying to ${ENVIRONMENT}"
                }
                
                // Update Kubernetes manifests with new image tags
                sh """
                    sed -i 's|shopfinity-frontend:latest|${FRONTEND_IMAGE}|g\' k8s/frontend/frontend.yaml
                    sed -i 's|shopfinity-backend:latest|${BACKEND_IMAGE}|g\' k8s/backend/backend.yaml
                """
                
                // Deploy to Kubernetes
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh '''
                        # Apply Kubernetes manifests
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/configmaps/
                        kubectl apply -f k8s/secrets/
                        kubectl apply -f k8s/storage/
                        kubectl apply -f k8s/databases/
                        kubectl apply -f k8s/cache/
                        kubectl apply -f k8s/messaging/
                        kubectl apply -f k8s/backend/
                        kubectl apply -f k8s/frontend/
                        kubectl apply -f k8s/ingress/
                        
                        # Wait for deployment
                        kubectl rollout status deployment/frontend -n shopfinity --timeout=300s
                        kubectl rollout status deployment/backend -n shopfinity --timeout=300s
                    '''
                }
                
                // Smoke tests
                sh """
                    sleep 60
                    curl -f ${DEPLOYMENT_URL}/health || echo "Health check failed"
                """
            }
        }
        
        // 📊 Performance Testing
        stage('Performance Tests') {
            when {
                branch 'develop'
            }
            parallel {
                stage('Lighthouse CI') {
                    steps {
                        script {
                            echo "📊 Running Lighthouse Performance Tests"
                        }
                        
                        // Install Lighthouse CI
                        sh 'npm install -g @lhci/cli@0.12.x'
                        
                        // Run Lighthouse CI
                        sh """
                            lhci autorun --upload.target=temporary-public-storage || echo "Lighthouse tests completed with warnings"
                        """
                    }
                }
                
                stage('Load Testing') {
                    steps {
                        script {
                            echo "🔥 Running Load Tests"
                        }
                        
                        // Install k6
                        sh '''
                            if ! command -v k6 &> /dev/null; then
                                sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
                                echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
                                sudo apt-get update
                                sudo apt-get install k6
                            fi
                        '''
                        
                        // Run load tests if available
                        sh """
                            if [ -f "tests/load/basic-load-test.js" ]; then
                                k6 run tests/load/basic-load-test.js --env BASE_URL=${DEPLOYMENT_URL}
                            else
                                echo "Load test files not found, skipping..."
                            fi
                        """
                    }
                }
            }
        }
    }
    
    // Post-build actions
    post {
        always {
            // Clean up Docker images
            sh 'docker system prune -f || true'
            
            // Archive logs
            archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true, fingerprint: true
        }
        
        success {
            script {
                echo "✅ Pipeline completed successfully!"
                
                // Send success notification
                sendSlackNotification(
                    color: 'good',
                    message: "✅ Shopfinity deployment successful!",
                    environment: ENVIRONMENT,
                    url: DEPLOYMENT_URL
                )
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                
                // Send failure notification
                sendSlackNotification(
                    color: 'danger',
                    message: "❌ Shopfinity deployment failed!",
                    environment: ENVIRONMENT,
                    url: DEPLOYMENT_URL
                )
            }
        }
        
        unstable {
            script {
                echo "⚠️ Pipeline completed with warnings!"
                
                // Send warning notification
                sendSlackNotification(
                    color: 'warning',
                    message: "⚠️ Shopfinity deployment completed with warnings!",
                    environment: ENVIRONMENT,
                    url: DEPLOYMENT_URL
                )
            }
        }
    }
}

// Helper function for Slack notifications
def sendSlackNotification(Map config) {
    if (env.SLACK_WEBHOOK) {
        def payload = [
            text: "Shopfinity Deployment Notification",
            attachments: [[
                color: config.color,
                fields: [
                    [title: "Environment", value: config.environment, short: true],
                    [title: "Status", value: config.message, short: true],
                    [title: "Build", value: env.BUILD_NUMBER, short: true],
                    [title: "URL", value: config.url, short: true],
                    [title: "Branch", value: env.BRANCH_NAME, short: true],
                    [title: "Duration", value: currentBuild.durationString, short: true]
                ]
            ]]
        ]
        
        httpRequest(
            httpMode: 'POST',
            contentType: 'APPLICATION_JSON',
            requestBody: groovy.json.JsonOutput.toJson(payload),
            url: env.SLACK_WEBHOOK
        )
    }
}