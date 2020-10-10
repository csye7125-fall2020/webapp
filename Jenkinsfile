pipeline {
  agent any
  tools {nodejs "node" }
  stages {
    stage('Show GIT_URL') {
      steps {
        echo '${GIT_URL}'
      }
    }
    stage('Cloning Git') {
      steps {
        git 'https://github.com/kinnarrk/webapp-1.git'
      }
    }
    stage('Build') {
       steps {
         sh 'npm install'
       }
    }
  }
}