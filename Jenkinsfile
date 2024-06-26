pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        KUBECONFIG_CREDENTIALS_ID = 'kubeconfig-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/your-repo.git', branch: 'main'
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('', env.DOCKER_CREDENTIALS_ID) {
                        docker.build('your-docker-repo/frontend', './frontend').push()
                        docker.build('your-docker-repo/backend', './backend').push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s/sqlite-pv.yaml'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
                    sh 'kubectl apply -f k8s/sqlite-deployment.yaml'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
