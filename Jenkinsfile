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
        git credentialsId: 'git_fork_private_key', url: 'git@github.com:kinnarrk/webapp-1.git'
      }
    }
    stage('Build') {
       steps {
         sh 'npm install'
       }
    }
  }
}