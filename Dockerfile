FROM docker.io/library/node:20-bookworm as node-helper

RUN apt update && apt install -y wget && \
    wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb
WORKDIR /app
COPY . .
RUN npm install
RUN npm test
RUN npx ng build

FROM docker.io/library/nginx:alpine as ngx

RUN apk add --no-cache gettext-envsubst
COPY --from=node-helper /app/dist/front /usr/share/nginx/html/front
COPY nginx.conf /etc/nginx/templates/default.conf.template
CMD envsubst "\$API_URL \$AUTH_URL \$SSL_CERT_PATH \$SSL_KEY_PATH \$SSL_CA_CERT_PATH" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
