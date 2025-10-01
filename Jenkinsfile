pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "pavdev777/todo-backend:latest"
        FRONTEND_IMAGE = "pavdev777/todo-frontend:latest"
        NAMESPACE = "todoapp"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    sh "docker build -t ${BACKEND_IMAGE} ./backend"
                    sh "docker build -t ${FRONTEND_IMAGE} ./frontend"

                    withCredentials([usernamePassword(credentialsId: 'dockerhub_creds',
                                                      usernameVariable: 'DOCKER_USER',
                                                      passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    }

                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${FRONTEND_IMAGE}"
                }
            }
        }

        stage('Deploy Helm') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh """
                    helm upgrade --install todoapp charts/todoapp \
                      --namespace ${NAMESPACE} --create-namespace \
                      --set backend.image.repository=pavdev777/todo-backend \
                      --set frontend.image.repository=pavdev777/todo-frontend \
                    """
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