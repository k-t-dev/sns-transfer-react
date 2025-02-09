# Step 1: Use Node.js as the base image for the build stage
FROM node:18 as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Use Nginx for serving the React app
FROM nginx:alpine

# Copy the built files from the builder stage to the Nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]


# Run-> docker build -t react-app . 
#Run-> docker run -d -p 3000:80 react-app
