pipeline{
    environment {
        registry = "hub.ahochschulte.de/url_shortener"
        registryCredential = "privatehub"
        dockerImage = ''
        dockerFile = 'Dockerfile'
    }

    agent any
    tools {nodejs "node"}
    stages{
        stage('Build image'){
            steps{
                script {
                    dockerImage = docker.build(registry + ":$BUILD_NUMBER", "-f "+ dockerFile)
                }
            }
        }

        stage('Push Image to Registry'){
            steps{
                script{
                    docker.withRegistry('https://hub.ahochschulte.de/v2', registryCredential){
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }

        stage('Publish on remote server'){
            steps{
                script{
                    sh 'ssh dev@81.169.193.248 "cd ~/node/url_shortener && docker-compose pull app && docker-compose up -d"'
                }
            }
            
        }
    }
}