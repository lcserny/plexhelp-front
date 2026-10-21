FROM docker.io/library/node:24-bookworm as node-helper

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
RUN npx playwright install --with-deps chromium
COPY . .
RUN npm test
RUN npx ng build

FROM docker.io/library/nginx:alpine as ngx

RUN apk add --no-cache gettext-envsubst
COPY --from=node-helper /app/dist/front/browser /usr/share/nginx/html/front
COPY nginx.conf /etc/nginx/templates/default.conf.template
CMD envsubst "\$API_URL \$AUTH_URL \$SSL_CERT_PATH \$SSL_KEY_PATH \$SSL_CA_CERT_PATH" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
