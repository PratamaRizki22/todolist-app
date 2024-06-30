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

        stage('Docker Composer') {
            steps {
                script {
                    sh 'docker-compose -p $IMAGE_NAME create'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_CREDENTIALS_ID) {
                        sh 'docker push $IMAGE_NAME'
                    }
                }
            }
        }


        stage('Deploy to GCE') {
            steps {
                sshagent([env.SSH_CREDENTIALS_ID]) {
                    script {
                        sh """
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker stop todolist-app || true'
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker rm todolist-app || true'
                        ssh -o StrictHostKeyChecking=no dominepa@$GCE_VM_IP 'docker run -d --name todolist-app -p 3000:3000 -p 5000:5000 $IMAGE_NAME:latest'
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
