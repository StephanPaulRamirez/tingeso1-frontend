pipeline {
    agent any
    tools{
        nodejs 'node'
    }
    stages{
        stage('create build'){
            steps{
                checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/StephanPaulRamirez/tingeso1-frontend']])
                bat 'npm run build'
            }
        }

        stage('Build docker image'){
            steps{
                script{
                    bat 'docker build -t stephanpaulramirez/frontend . --no-cache'
                }
            }
        }
        stage('Push image to Docker Hub'){
            steps{
                script{
                   withCredentials([string(credentialsId: 'dhpswid', variable: 'dhpsw')]) {
                        bat 'docker login -u stephanpaulramirez -p %dhpsw%'
                   }
                   bat 'docker push stephanpaulramirez/frontend:latest'
                }
            }
        }
    }
}