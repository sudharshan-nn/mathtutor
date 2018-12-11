#EC2 Deployment

##Install NVM
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

. ~/.nvm/nvm.sh

nvm install 8.11.13
```

##Copy Mathtutor folder to EC2
Copy Mathtutor folder to EC2

Login to EC2 and move into Mathtutor folder

run

```
npm install

npm start

```

The node process should run now


## Create Security group
Move to the security group assigned to the EC2 instance

Move to inbound tab and edit

add

|Type               |Protocal   |Port Range |Source     |
|-------------------|-----------|-----------|-----------|
|Custom TCP Rule    |TCP        |3000       |0.0.0.0/0  |
|Custom TCP Rule    |TCP        |3000     	|::/0       |
|HTTPS              |TCP        |443        |0.0.0.0/0  |
|HTTPS              |TCP        |443     	|::/0       |