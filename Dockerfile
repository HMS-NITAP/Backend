# Use a base image that includes Node.js and necessary build tools
FROM node:14

# Install necessary system packages and Google Chrome
RUN apt-get update \
    && apt-get install -y \
       wget \
       gnupg \
       fonts-liberation \
       libasound2 \
       libatk-bridge2.0-0 \
       libatk1.0-0 \
       libcups2 \
       libdrm2 \
       libgbm1 \
       libnspr4 \
       libnss3 \
       libxcomposite1 \
       libxdamage1 \
       libxrandr2 \
       xdg-utils \
       libu2f-udev \
       libvulkan1 \
       libxshmfence1 \
       libwayland-server0 \
       libwayland-egl1 \
       libwayland-client0 \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable

# Set environment variables if needed
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Copy your application code to the container
COPY . /app

# Set the working directory
WORKDIR /app

# Install Node.js dependencies
RUN npm install

# Expose the port your app runs on
EXPOSE 3000

# Start your application
CMD ["npm", "start"]
