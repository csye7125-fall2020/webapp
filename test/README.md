## Testing app with dockerized environment


Create a public repository on docker hub. Name it `docker-jenkins`

### Build image
```
sudo docker build -t <your docker username>/docker-jenkins .
```

### Push image to Docker hub
```
sudo docker push <your docker username>/docker-jenkins:latest
```

*In case you are not logged in, use below command to login to Docker hub*
```
sudo docker login -u <your docker username> --password-stdin
```

### Run the image
```
docker run -d --name jenkins-docker -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock <your docker username>/docker-jenkins:latest
```

### Get the initial admin password
```
docker exec -it jenkins-docker /bin/bash
cat /var/jenkins_home/secrets/initialAdminPassword
```

Now run the app on `http://localhost:8080`
