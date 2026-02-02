# Base image
FROM node:20

WORKDIR /app

# Copy package.json
COPY package*.json ./

RUN npm install

# Copy all frontend files
COPY . .

# Build production frontend
RUN npm run build

# Install serve to host frontend
RUN npm install -g serve

# Expose port 3000
EXPOSE 5173

# Start serving frontend
CMD ["serve", "-s", "dist", "-l", "3000"]
