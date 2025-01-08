# Use Node.js as the base image
FROM node:16

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
    google-chrome-stable

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all project files
COPY . .

# Set environment variable for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Expose the port your app will run on
EXPOSE 3000

# Run your application
CMD ["node", "index.js"]