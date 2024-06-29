pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        GIT_CREDENTIALS_ID = 'git-credentials'
        SSH_CREDENTIALS_ID = 'gce-ssh-key'
        GCE_VM_IP = '35.202.78.230'
    }

    stages {
        stage('Install Docker Compose') {
            steps {
                script {
                    sh '''
                    if ! [ -x "$(command -v docker-compose)" ]; then
                      sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                      sudo chmod +x /usr/local/bin/docker-compose
                    fi
                    '''
                }
            }
        }

        stage('Checkout') {
            steps {
                git url: 'https://github.com/pratamarizki22/todolist-app.git', branch: 'master', credentialsId: env.GIT_CREDENTIALS_ID
            }
        }

        stage('Build and Push Docker Compose') {
            steps {
                script {
                    sh 'docker-compose build'
                    sh 'docker-compose push'
                }
            }
        }

        stage('Copy Docker Compose to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    sh '''
                    scp -o StrictHostKeyChecking=no docker-compose.yml jenkis-server@$GCE_VM_IP:/home/jenkis-server/docker-compose.yml
                    '''
                }
            }
        }

        stage('Deploy to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no jenkis-server@$GCE_VM_IP '
                    docker-compose -f /home/jenkis-server/docker-compose.yml pull &&
                    docker-compose -f /home/jenkis-server/docker-compose.yml down &&
                    docker-compose -f /home/jenkis-server/docker-compose.yml up -d
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
