pipeline {
  environment {
    dockerRegistry = "kansarak/webapp"
    dockerRegistryCredential = 'jenkins_docker_login'
    dockerImage = ''
  }
  agent any
  tools {nodejs "node" }
  stages {
    stage('Show GIT_URL') {
      steps {
        sh "echo ${env.GIT_URL}"
      }
    }
    stage('Cloning Git') {
      steps {
        git credentialsId: 'git_fork_private_key', url: 'git@github.com:kinnarrk/webapp-1.git'
      }
    }
    stage('Build') {
       steps {
         sh 'npm install'
       }
    }
    stage('Building image') {
       steps{
         script {
           dockerImage = docker.build dockerRegistry + ":$BUILD_NUMBER"
         }
       }
     }
     stage('Upload Image') {
       steps{
         script {
           docker.withRegistry( '', dockerRegistryCredential ) {
             dockerImage.push("${env.BUILD_NUMBER}")
             dockerImage.push("latest")
           }
         }
       }
     }
     stage('Remove Unused docker image') {
       steps{
         sh "docker rmi $dockerRegistry:$BUILD_NUMBER"
       }
     }
  }
}