pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        KUBECONFIG_CREDENTIALS_ID = 'kubeconfig-credentials'
        GIT_CREDENTIALS_ID = 'git-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/your-username/your-repo.git', branch: 'main', credentialsId: env.GIT_CREDENTIALS_ID
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_CREDENTIALS_ID) {
                        docker.build('your-docker-repo/frontend', './frontend').push('latest')
                        docker.build('your-docker-repo/backend', './backend').push('latest')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                    sh 'echo "$KUBECONFIG" > $HOME/.kube/config'
                    sh 'kubectl apply -f k8s/sqlite-pv.yaml'
                    sh 'kubectl apply -f k8s/sqlite-pvc.yaml'
                    sh 'kubectl apply -f k8s/sqlite-deployment.yaml'
                    sh 'kubectl apply -f k8s/backend-deployment.yaml'
                    sh 'kubectl apply -f k8s/frontend-deployment.yaml'
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
