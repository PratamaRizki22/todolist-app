pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        GIT_CREDENTIALS_ID = 'git-credentials'
        SSH_CREDENTIALS_ID = 'gce-ssh-key'
        GCE_VM_IP = '35.202.78.230'
        IMAGE_NAME = 'pratamarizki22/todolist-app'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/pratamarizki22/todolist-app.git', branch: 'master', credentialsId: env.GIT_CREDENTIALS_ID
            }
        }

        stage('Clean Old Docker Images') {
            steps {
                script {
                    sh """
                    docker stop $IMAGE_NAME:latest || true &&
                    docker rm $IMAGE_NAME:latest || true &&
                    docker rmi $IMAGE_NAME:latest || true
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker-compose build --no-cache'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_CREDENTIALS_ID) {
                        sh 'docker push $IMAGE_NAME:latest'
                    }
                }
            }
        }

        stage('Deploy to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    script {
                        sh """
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker stop $IMAGE_NAME:latest || true'
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker rm $IMAGE_NAME:latest || true'
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker rmi $IMAGE_NAME:latest || true'
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker pull $IMAGE_NAME:latest'
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker run -d --name $IMAGE_NAME:latest -p 3000:3000 -p 5000:5000 $IMAGE_NAME:latest'
                        """
                    }
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
