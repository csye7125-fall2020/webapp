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
        git '${GIT_URL}'
      }
    }
    stage('Build') {
       steps {
         sh 'npm install'
       }
    }
  }
}