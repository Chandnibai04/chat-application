# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose port (5000 for HTTPS)
EXPOSE 5000

# Start backend (HTTPS server)
CMD ["node", "src/server.js"]
