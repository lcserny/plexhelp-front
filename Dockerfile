FROM docker.io/library/node:20-bookworm as node-helper
RUN apt update && apt install -y wget \
    && wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && apt install -y ./google-chrome-stable_current_amd64.deb \
    && rm ./google-chrome-stable_current_amd64.deb
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node . .
RUN npm cache clean --force && npm install
RUN npm test && npx ng build

# NOTE: uses nginx user (UID 101 not 1000 as the other containers), its safe since it doesnn't write to any mounts, no perm issues
FROM docker.io/library/nginx:alpine as ngx
RUN apk add --no-cache gettext-envsubst
RUN mkdir -p /usr/share/nginx/html/front && \
    chown -R nginx:nginx /usr/share/nginx/html/front
RUN chown -R nginx:nginx /etc/nginx/conf.d /var/cache/nginx /var/run /var/log/nginx
COPY --from=node-helper --chown=nginx:nginx /app/dist/front /usr/share/nginx/html/front
COPY nginx.conf /etc/nginx/templates/default.conf.template
RUN chmod 644 /etc/nginx/templates/default.conf.template
CMD ["sh", "-c", "envsubst \"\\$API_URL \\$AUTH_URL \\$SSL_CERT_PATH \\$SSL_KEY_PATH \\$SSL_CA_CERT_PATH\" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
