# MERN Stack-project

A full stack application developed using React.js Node.js Express and MongoDB.
Supports the features like: 
User sign up and user login, and CRUD operations on MongoDB
---------------------------------------------------------------------------------------------------------
To Deploy on AWS & MongoDB Atlas

https://jasonwatmore.com/post/2019/11/18/react-nodejs-on-aws-how-to-deploy-a-mern-stack-app-to-amazon-ec2

Changes in project:

in react make base url " /api/
in server run at port 5000
in server connect with mongodb atlas

In ec2: 

sudo apt-get update
sudo apt-get install -y nodejs
sudo apt-get install -y nginx
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable


folder structure:
ubuntu/client/deploy/{react_build_file}
ubuntu/server/{server_files}

...run npm install for node modules


Nginx server will redirect every exernal request to port 80, and every 
request from react will have base url as /api/
this /api/ will be redirected internally nginx to port 5000, where node
server sits


sudo rm /etc/nginx/sites-available/default
sudo vi /etc/nginx/sites-available/default

cut all and paste following:

server {
  listen 80 default_server;
  server_name _;

  # react app & front-end files
  location / {
    root   /home/ubuntu/client/deploy;
    index  index.html index.htm;
    try_files $uri /index.html;
  }

  # node api reverse proxy
  location /api/ {
    proxy_pass http://localhost:5000/;
  }
}

sudo systemctl restart nginx


