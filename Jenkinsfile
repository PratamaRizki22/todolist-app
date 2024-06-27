pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'docker-credentials'
        GIT_CREDENTIALS_ID = 'git-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/pratamarizki22/todolist-app.git', branch: 'master', credentialsId: env.GIT_CREDENTIALS_ID
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', env.DOCKER_CREDENTIALS_ID) {
                        docker.build('pratamarizki22/todolist-app', '.').push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Hentikan kontainer yang berjalan jika ada
                    sh 'docker stop todolist-app || true && docker rm todolist-app || true'
                    
                    // Jalankan kontainer baru
                    sh 'docker run -d --name todolist-app -p 3000:3000 -p 5000:5000 pratamarizki22/todolist-app:latest'
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
