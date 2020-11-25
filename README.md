## Web Application
demo command
This is a web application implemented with create, update, and retrieve user functionalities.
This application provides secured API endpoints to protect user information. 
'Basic Authentication' validates the user and give response only for authorized users. 
However, there some public APIs accessible to every user without passing any explicit validation.


##### Protected REST Endpoints

1. GET : Gets user information

   Endpoint: `/v1/user/self`
   
   Response Code: 
   
        - 200: OK on SUCCESS
        - 401: Access Forbidden on AUTH fail
   
2. PUT: Updates user information. User cannot update their username once created. Not all the parameters are mandatory but at least one field should be there to update.

   Request Body: 
   
        {            
            "firstName": "<first_name>",
            "lastName": "<last_name>",
            "password": "<password>"            
        }
    
   Endpoint: `/v1/user/self`
   
   Response Code: 
      
       - 201: No-Content on SUCCESS
       - 401: Access Forbidden on AUTH fail
       - 400: Bad Request on INVALID parameters
 
3. POST: Create a new watch. There can be multiple alerts a watch can have.
    
    Field Type List: `[ temp, feels_like, temp_min, temp_max, pressure, humidity ]`
    
    Operator List: `[ gt, gte, eq, lt, lte ]`
    
    Request Body:
    
        {
          "zipcode": "<zip_code>",
          "alerts": [
            {
              "fieldType": "<any one of field_type list>",
              "operator": "<any one of operator list>",
              "value": <value>
            }
            .
            .
            .
          ]
        }
        
    Endpoint: `/v1/watch/`
    
    Response Code: 
          
           - 201: created watch on SUCCESS
           - 401: Access Forbidden on AUTH fail
           - 400: Bad Request on INVALID parameters
 
 4. GET: Retrieve watch information by ID
    
    Endpoint: `/v1/watch/:id`
    
    Response Code: 
          
         - 200: Ok on SUCCESS
         - 401: Access Forbidden on AUTH fail
         - 400: Bad Request on INVALID ID
         
 5. DELETE: Delete the watch from the system. It will remove all the associated alerts with the watch.
 
     Endpoint: `/v1/watch/:id`
         
     Response Code: 
           
          - 200: Ok on SUCCESS
          - 401: Access Forbidden on AUTH fail
          - 400: Bad Request on INVALID ID
          
 6. PUT: Update the watch or alert information. You can update one alert at a time. WatchId must be present in the URL. AlertId has to be part of the request body. You can skip alert definition if you want to update only zipcode and vice versa.
 
    Request Body:
    
        {
            "zipcode" : <new_zip_code>,
            "alerts" : [{
                "alertId": "<alert_id>",
                "value": <new_value>
            }]
        }
 
    Endpoint: `/v1/watch/:id`
          
    Response Code: 
            
           - 200: Ok on SUCCESS
           - 401: Access Forbidden on AUTH fail
           - 400: Bad Request on INVALID ID
           - 404: Invalid Alert or Watch ID
    
 
##### Public REST Endpoints
 
1.  POST: Creates a new user in the system

    Request Body: 
   
        {            
            "firstName": "<first_name>",
            "lastName": "<last_name>",
            "username": "<username>",
            "password": "<password>"            
        }
   
    Endpoint: `/v1/user/`
      
    Response Code: 
               
        - 200: Ok on SUCCESS
        - 400: Bad Request on INVALID parameters


2. GET: Gets user information By ID

   Endpoint: `/v1/user/:id`
   
   Response Code: 
         
        - 200: Ok on SUCCESS
        - 400: Bad Request on INVALID ID

### Installing helm chart

Make sure the context for kubernetes is defined for `kubectl` and `helm` is installed

To create new deployment, use below command to deploy `webapp` application
```
helm install poller ./helm/webapp-helm/ -f ./helm/my-values.yaml
```
Things to consider:
- First you need to create `kubernetes` secret by executing below command
    ```    
    kubectl create secret docker-registry regcred --docker-server=https://index.docker.io/v1/ --docker-username=<docker_hub_uname> --docker-password=<docker_hub_password> --docker-email=<email_used_for_docker_hub>
    ```
    Get the secret by executing
    ```
    kubectl get secret regcred --output=yaml
    ```
    Copy base64 value in `imageCredentials.dockerconfig` of `my-values.yaml`.

- Replace the RDS instance endpoint in `rdsdata.db_host`.


Example `my-values.yaml` will look like:
    
    imageCredentials:
      dockerconfig: <your secret>

    spec:
      imageName: <docker username/webapp:latest

    rdsdata:
      db_host: webapp-rds-instance.abcd0123456.us-east-1.rds.amazonaws.com
      db_name: csye7125_poller
      db_user: <my_db_username>
      db_password: <my_db_password>

## Team Members
#### 1. Kinnar Kansara
#### 2. Rajashree Joshi
