# STEP-1 BUILD
# Defining node image and giving alias as node-helper
# It's better to define version otherwise me might face issue in future build
FROM docker.io/library/node:20-bookworm as node-helper

#install chrome, needed for testing
RUN apt update
RUN apt install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt install -y ./google-chrome-stable_current_amd64.deb

#Creating virtual directory inside docker image
WORKDIR /app

RUN npm cache clean --force

#Copying file from local machine to virtual docker image directory
COPY . .

#installing deps for project
RUN npm install

#run tests
RUN npm test

#creating angular build
RUN npx ng build

#STEP-2 RUN
#Defining nginx img
FROM docker.io/library/nginx:alpine as ngx

RUN apk add --no-cache gettext-envsubst

#copying compiled code from dist to nginx folder for serving
COPY --from=node-helper /app/dist/front /usr/share/nginx/html/front

#copying nginx config from local to image
COPY nginx.conf /etc/nginx/templates/default.conf.template

#exposing internal port
EXPOSE 80

CMD envsubst "\$API_URL \$SECURITY_URL" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
