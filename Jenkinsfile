pipeline {
    agent any

    environment {
        REGISTRY = "demotao.top:5000"
        PROJECT = "documind"
        // Jenkins Credentials ID for K8s config
        KUBECONFIG_ID = "k8s-config" 
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'develop') {
                        env.DEPLOY_ENV = 'dev'
                        env.IMAGE_TAG = "dev-${env.BUILD_NUMBER}"
                    } else if (env.TAG_NAME != null) {
                        env.DEPLOY_ENV = 'prod'
                        env.IMAGE_TAG = env.TAG_NAME
                    } else if (env.BRANCH_NAME.startsWith('release/')) {
                        env.DEPLOY_ENV = 'staging'
                        env.IMAGE_TAG = "rc-${env.BUILD_NUMBER}"
                    } else {
                        env.DEPLOY_ENV = 'feature'
                        env.IMAGE_TAG = "feat-${env.BUILD_NUMBER}"
                    }
                    echo "Deploy Environment: ${env.DEPLOY_ENV}, Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build & Test') {
            parallel {
                stage('Frontend') {
                    when { changeset "frontend/**" }
                    steps {
                        dir('frontend') {
                            sh 'pnpm install'
                            sh 'pnpm lint'
                            sh 'pnpm build'
                        }
                    }
                }
                stage('Backend') {
                    when { changeset "backend/**" }
                    steps {
                        dir('backend') {
                            sh 'mvn test'
                            sh 'mvn package -DskipTests'
                        }
                    }
                }
                stage('AI Engine') {
                    when { changeset "ai-engine/**" }
                    steps {
                        dir('ai-engine') {
                            sh 'pip install -r requirements.txt'
                            // sh 'pytest' // Uncomment when tests are ready
                        }
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            when {
                anyOf {
                    branch 'develop'
                    tag 'v*'
                    branch 'release/*'
                }
            }
            parallel {
                stage('Push Frontend') {
                    when { changeset "frontend/**" }
                    steps {
                        script {
                            def image = "${env.REGISTRY}/${env.PROJECT}/frontend:${env.IMAGE_TAG}"
                            sh "docker build -t ${image} ./frontend"
                            sh "docker push ${image}"
                        }
                    }
                }
                stage('Push Backend') {
                    when { changeset "backend/**" }
                    steps {
                        script {
                            def image = "${env.REGISTRY}/${env.PROJECT}/backend:${env.IMAGE_TAG}"
                            sh "docker build -t ${image} ./backend"
                            sh "docker push ${image}"
                        }
                    }
                }
                stage('Push AI Engine') {
                    when { changeset "ai-engine/**" }
                    steps {
                        script {
                            def image = "${env.REGISTRY}/${env.PROJECT}/ai-engine:${env.IMAGE_TAG}"
                            sh "docker build -t ${image} ./ai-engine"
                            sh "docker push ${image}"
                        }
                    }
                }
            }
        }

        stage('Deploy to K8s') {
            when {
                anyOf {
                    branch 'develop'
                    tag 'v*'
                }
            }
            steps {
                withCredentials([file(credentialsId: "${env.KUBECONFIG_ID}", variable: 'KUBECONFIG')]) {
                    script {
                        def namespace = "documind-${env.DEPLOY_ENV}"
                        
                        // Create namespace if not exists
                        sh "kubectl apply -f deploy/k8s/namespace.yaml"
                        
                        // Deploy services
                        ['frontend', 'backend', 'ai-engine'].each { service ->
                            def image = "${env.REGISTRY}/${env.PROJECT}/${service}:${env.IMAGE_TAG}"
                            // Update image in deployment
                            sh "kubectl set image deployment/documind-${service} ${service}=${image} -n ${namespace} --record"
                            // Apply service definition (if changed)
                            sh "kubectl apply -f deploy/k8s/${service}.yaml -n ${namespace}"
                        }
                        
                        // Apply Ingress
                        sh "kubectl apply -f deploy/k8s/ingress.yaml -n ${namespace}"
                    }
                }
            }
        }
    }
}
