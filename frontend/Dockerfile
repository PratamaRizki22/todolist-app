# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Use an official Nginx image to serve the app
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
