# Step 1: Use an official Node.js runtime as a parent image
FROM node:16

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy application files
COPY . .

# Step 6: Pass build arguments as environment variables
ARG NODE_ENV
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY
ENV NODE_ENV=${NODE_ENV}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Step 7: Expose the backend server port
EXPOSE 5000

# Step 8: Define the command to run the backend app
CMD ["npm", "start"]
