# express-mongo-backend

## Run with Docker Container
```bash
docker-compose up
```
## Run Manually without Container
start Mongo
```bash
mongod --dbpath=data --bind_ip 127.0.0.1
```
MongoDB server will run on localhost:27017
<br/><br/>

Install dependencies
```bash
nvm install
```
Run node application
```bash
nvm start
```
Application will run on https://localhost:3443

## Technology Used:
- Developed Express backend server with SSL protocols, allows client-server communications in a secure channel 
- Implemented CORS with Preflight approach to improve the security of backend modifications on NoSQL models stored in MongoDB
- Implemented JWT and integration of OAuth2 with Facebook Passport for account authentication
- Containerized with Docker and could be deployed to a load-balanced Kubernetes cluster using AWS


## Backend System Structure Diagram:

![Structure Diagram (Express-Mongo) (1)](https://user-images.githubusercontent.com/46879202/105741181-026ce480-5f08-11eb-81e0-5854963041c7.png)
