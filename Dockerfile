FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN dir -s
WORKDIR /home/pptruser/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "cashewbot/main.js"]
