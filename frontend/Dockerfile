# thanks ChatGPT for this Dockerfile! Looks suprisingly simple and easy to understand

# Use Node.js LTS version as the base image
FROM node:lts-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN yarn build

# Stage 2: Serve the built files using a lightweight HTTP server
FROM nginx:alpine

# Copy built files from the previous stage to Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]