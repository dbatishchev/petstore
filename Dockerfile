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
RUN yarn run build

# Expose the port your app runs on
EXPOSE 3000

# Copy the script to run additional commands
COPY entrypoint.sh .

# Give execute permission to the script
RUN chmod +x entrypoint.sh

# Start the NestJS application
CMD ["./entrypoint.sh"]