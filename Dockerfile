# Dockerfile
# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the application
RUN npm run build
#
## Expose the port your app runs on
#EXPOSE 3000
#
## Command to run the app
#CMD ["npm", "run", "start:prod"]
