## Web Application


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

## Team Members
#### 1. Kinnar Kansara
#### 2. Rajashree Joshi
