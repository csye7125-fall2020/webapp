pipeline {
  environment {
    dockerRegistry = "${env.dockerRegistry}"
    dockerRegistryCredential = "${env.dockerRegistryCredential}"
    dockerImage = ''
  }
  agent any
  tools {nodejs "node" }
  stages {
    stage('Show GIT_URL') {
      steps {
        sh "echo ${env.GIT_URL}"
        sh "whoami"
      }
    }
    stage('Cloning Git') {
      steps {
        git credentialsId: 'git_fork_private_key', url: "${env.GIT_URL}"
      }
    }
    stage('Get last git commit') {
       steps {
           script {
                git_hash = sh(returnStdout: true, script: "git rev-parse HEAD").trim()
           }
       }
    }
    stage('Write file my-values.yaml') {
      steps{
        writeFile file: 'helm/my-values.yaml', text: "${env.my_values_yaml}"
      }
    }
    stage('Write file my-values.yaml with updated git hash') {
      steps{
        def filename = 'helm/my-values.yaml'
        def data = readYaml file: filename

        // Change something in the file
        data.spec.imageName = "$dockerRegistry:${git_hash}"

        sh "rm $filename"
        writeYaml file: filename, data: data
      }
    }
    stage('Show modified yaml') {
      steps {
        sh "echo Modified YAML"
        sh "cat helm/my-values.yaml"
      }
    }
  }
}

