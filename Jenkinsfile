pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "pavdev777/todo-backend:${BUILD_NUMBER}"
        FRONTEND_IMAGE = "pavdev777/todo-frontend:${BUILD_NUMBER}"
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
                      --set backend.image.tag=${BUILD_NUMBER} \
                      --set frontend.image.repository=pavdev777/todo-frontend \
                      --set frontend.image.tag=${BUILD_NUMBER}
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