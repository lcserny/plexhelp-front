# STEP-1 BUILD
# Defining node image and giving alias as node-helper
# It's better to define version otherwise me might face issue in future build
FROM node:20-bookworm as node-helper

#install chrome, needed for testing
RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

#Creating virtual directory inside docker image
WORKDIR /app

RUN npm cache clean --force

#Copying file from local machine to virtual docker image directory
COPY . .

#installing deps for project
RUN npm install

#run tests
RUN npm test

#generate classes from OpenAPI spec
RUN npm run specgen

#creating angular build
RUN npx ng build

#STEP-2 RUN
#Defining nginx img
FROM nginx:1.20 as ngx

#copying compiled code from dist to nginx folder for serving
COPY --from=node-helper /app/dist/front /usr/share/nginx/html/front

#copying nginx config from local to image
COPY nginx.conf /etc/nginx/conf.d/default.conf

#exposing internal port
EXPOSE 81
