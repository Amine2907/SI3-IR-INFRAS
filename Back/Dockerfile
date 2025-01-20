# Step 1: Use an official Node.js runtime as a parent image
FROM node:16

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json from the 'back' folder
COPY back/package*.json ./

# Step 4: Install the backend dependencies
RUN npm install

# Step 5: Copy the rest of the backend application code
COPY ./back/ /app/

# Step 6: Expose the backend server port
EXPOSE 5000

# Step 7: Define the command to run the backend app
CMD ["npm", "start"]
