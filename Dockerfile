FROM node:latest

WORKDIR /

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Install puppeteer dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libfontconfig1 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libxss1 \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils

ENV PUPPETEER_DOWNLOAD_PATH=/usr/local/chromium

RUN npm add puppeteer

EXPOSE 4000

CMD ["npm", "start"]