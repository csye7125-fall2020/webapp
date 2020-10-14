## Web Application
Demo again
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
   
2. PUT: Updates user information
    
   Endpoint: `/v1/user/self`
   
   Response Code: 
      
       - 201: No-Content on SUCCESS
       - 401: Access Forbidden on AUTH fail
       - 400: Bad Request on INVALID parameters
   
##### Public REST Endpoints
 
1.  POST: Creates a new user in the system
   
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
