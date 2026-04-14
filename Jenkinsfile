pipeline {
    agent any

    environment {
        // Replace with your Docker Hub username
        DOCKER_IMAGE = "yashvardhan/healthcare-app"
        SCANNER_HOME = tool 'SonarScanner'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/YashK3086/healthcare-devsecops.git'
            }
        }

        stage('SAST - SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=healthcare-app \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.login=${SONAR_AUTH_TOKEN}"
                }
            }
        }

        stage('SCA - npm audit') {
            steps {
                // Ensure we have a lockfile for the audit
                sh 'npm install --package-lock-only || true'
                sh 'npm audit --audit-level=high || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .'
                sh 'docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest'
            }
        }

        stage('Container Image Scan - Trivy') {
            steps {
                // Scanning for High and Critical vulnerabilities
                sh 'trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${BUILD_NUMBER}'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Kubernetes Deployment') {
            steps {
                sh "kubectl apply -f secret.yaml"
                sh "kubectl apply -f deployment.yaml"
                // Update image to the specific build
                sh "kubectl set image deployment/healthcare-app healthcare=${DOCKER_IMAGE}:${BUILD_NUMBER}"
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
    }
}
