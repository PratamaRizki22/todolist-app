pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        GIT_CREDENTIALS_ID = 'git-credentials'
        SSH_CREDENTIALS_ID = 'gce-ssh-key'
        GCE_VM_IP = '35.202.78.230'
        IMAGE_NAME = 'your-dockerhub-username/your-image-name'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/pratamarizki22/todolist-app.git', branch: 'master', credentialsId: env.GIT_CREDENTIALS_ID
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_CREDENTIALS_ID) {
                        sh 'docker-compose push'
                    }
                }
            }
        }

        stage('Copy Files to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    script {
                        sh '''
                        scp -o StrictHostKeyChecking=no -r . jenkins-server@$GCE_VM_IP:/home/jenkins-server/todolist-app/
                        '''
                    }
                }
            }
        }

        stage('Deploy to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    script {
                        sh '''
                        ssh -o StrictHostKeyChecking=no jenkins-server@$GCE_VM_IP '
                        cd /home/jenkins-server/todolist-app &&
                        docker-compose down &&
                        docker-compose up -d
                        '
                        '''
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
