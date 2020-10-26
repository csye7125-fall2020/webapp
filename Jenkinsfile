pipeline {
  environment {
    dockerRegistry = "${env.dockerRegistry}"
    dockerRegistryCredential = "${env.dockerRegistryCredential}"
    dockerImage = ''
  }
  agent any
  tools {nodejs "node" }
  stages {
    stage('Install kubectl') {
      //Installing kubectl in Jenkins agent
      sh 'curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl'
      sh 'chmod +x ./kubectl && mv kubectl /usr/local/bin'
    }
    stage('Install helm') {
      //Installing helm in Jenkins agent
      sh 'curl -LO https://get.helm.sh/helm-v3.3.4-linux-amd64.tar.gz'
      sh 'tar -zxvf helm-v3.3.4-linux-amd64.tar.gz'
      sh 'chmod +x ./linux-amd64/helm && mv linux-amd64/helm /usr/local/bin/helm'
    }
    stage('Show GIT_URL') {
      steps {
        sh "echo ${env.GIT_URL}"
      }
    }
    stage('Cloning Git') {
      steps {
        git credentialsId: 'git_fork_private_key', url: "${env.GIT_URL}"
      }
    }
    stage('Build') {
       steps {
         sh 'npm install'
       }
    }
    stage('Get last git commit') {
       steps {
           script {
                git_hash = sh(returnStdout: true, script: "git rev-parse HEAD").trim()
           }
       }
    }
    stage('Building image') {
       steps{
         script {
           dockerImage = docker.build dockerRegistry + ":${git_hash}"
         }
       }
     }
     stage('Upload Image') {
       steps{
         script {
           docker.withRegistry( '', dockerRegistryCredential ) {
             dockerImage.push("${git_hash}")
             dockerImage.push("latest")
           }
         }
       }
     }
     stage('Remove Unused docker image') {
       steps{
         sh "docker rmi $dockerRegistry:${git_hash}"
       }
     }
    stage('Write file my-values.yaml') {
      writeFile file: 'helm/my-values.yaml', text: ${env.my_values_yaml}
    }
    stage('Helm upgrade') {
      steps{
        sh "helm install webapp  ./helm/webapp-helm/ -f helm/my-values.yaml --set spec.imageName=$dockerRegistry:${git_hash}"
      }
    }
  }
}

