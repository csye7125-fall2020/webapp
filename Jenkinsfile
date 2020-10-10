pipeline {
  agent any
  tools {nodejs "node" }
  stages {
    stage('Cloning Git') {
      steps {
        git 'git@github.com:kinnarrk/webapp-1.git'
      }
    }
    stage('Build') {
       steps {
         sh 'npm install'
       }
    }
  }
}