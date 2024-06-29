pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        GIT_CREDENTIALS_ID = 'git-credentials'
        SSH_CREDENTIALS_ID = 'gce-ssh-key'
        GCE_VM_IP = '35.202.78.230'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/pratamarizki22/todolist-app.git', branch: 'master', credentialsId: env.GIT_CREDENTIALS_ID
            }
        }

        stage('Build and Push Docker Compose') {
            steps {
                script {
                    // Build Docker Compose services
                    sh 'docker-compose build'
                    // Push Docker images to Docker Hub (optional, if using a registry)
                    sh 'docker-compose push'
                }
            }
        }

        stage('Copy Docker Compose to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    script {
                        sh '''
                        scp -o StrictHostKeyChecking=no docker-compose.yml jenkins-server@$GCE_VM_IP:/home/jenkins-server/docker-compose.yml
                        '''
                    }
                }
            }
        }

        stage('Deploy to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no jenkins-server@$GCE_VM_IP '
                    docker-compose -f /home/jenkins-server/docker-compose.yml pull &&
                    docker-compose -f /home/jenkins-server/docker-compose.yml down &&
                    docker-compose -f /home/jenkins-server/docker-compose.yml up -d
                    '
                    '''
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
