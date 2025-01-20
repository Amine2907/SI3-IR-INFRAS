# Step 1: Build the React app
FROM node:16 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Build the React app
RUN npm run build

# Step 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy the build folder from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
