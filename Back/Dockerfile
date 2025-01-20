# Step 1: Use an official Node.js runtime as a parent image
FROM node:16

# Step 2: Set the working directory in the container
WORKDIR /app

<<<<<<< HEAD
# Step 3: Copy package.json and package-lock.json from the root folder
=======
# Step 3: Copy package.json and package-lock.json
>>>>>>> 58da7c77f7ff7184744954034c80a6423b1d7fd4
COPY back/package*.json ./

# Step 4: Install the backend dependencies
RUN npm install

# Step 5: Copy the rest of the application code from the backend folder
COPY back/ . 

# Step 6: Expose the backend server port
EXPOSE 5000

# Step 7: Define the command to run your app
CMD ["npm", "start"]
