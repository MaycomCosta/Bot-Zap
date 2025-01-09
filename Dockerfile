# Use Node.js as the base image
FROM node:18

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libxss1 \
    libgbm1 \
    wget \
    gnupg && \
    wget -qO - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json and list files to confirm
COPY package.json package-lock.json ./
RUN ls -la /app

# Install project dependencies and list installed modules
RUN npm ci --production && npm list --depth=0

# Copy all other project files and list directory content
COPY . .
RUN ls -la /app

# Set environment variable for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV NODE_OPTIONS="--experimental-modules"

# Expose the port your app will run on
EXPOSE 3000

# Run your application
CMD ["npm", "start"]