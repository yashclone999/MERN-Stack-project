# MERN Stack-project

A full stack application developed using React.js Node.js Express and MongoDB.
Supports the features like: 
User sign up and user login, and CRUD operations on MongoDB
---------------------------------------------------------------------------------------------------------
To Deploy on AWS & MongoDB Atlas <br />

https://jasonwatmore.com/post/2019/11/18/react-nodejs-on-aws-how-to-deploy-a-mern-stack-app-to-amazon-ec2 <br />

Changes in project: <br />

in react make base url " /api/ <br />
in server run at port 5000 <br />
in server connect with mongodb atlas <br />

In ec2:  <br />

sudo apt-get update <br />
sudo apt-get install -y nodejs <br />
sudo apt-get install -y nginx <br />
sudo ufw allow OpenSSH <br />
sudo ufw allow 'Nginx Full' <br />
sudo ufw --force enable <br />


folder structure: <br />
ubuntu/client/deploy/{react_build_file} <br />
ubuntu/server/{server_files} <br />

...run npm install for node modules <br />


Nginx server will redirect every exernal request to port 80, and every  
request from react will have base url as /api/ <br />
this /api/ will be redirected internally nginx to port 5000, where node 
server sits <br />


sudo rm /etc/nginx/sites-available/default <br />
sudo vi /etc/nginx/sites-available/default <br />

cut all and paste following: <br />

server {<br />
  listen 80 default_server;<br />
  server_name _;<br />

  
  location / {<br />
    root   /home/ubuntu/client/deploy;<br />
    index  index.html index.htm;<br />
    try_files $uri /index.html;<br />
  }<br />

  
  location /api/ {<br />
    proxy_pass http://localhost:5000/;<br />
  }<br />
}<br />

sudo systemctl restart nginx


