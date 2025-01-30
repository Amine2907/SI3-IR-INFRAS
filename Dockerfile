# Step 1: Build the Frontend
FROM node:16 AS Frontend-build
WORKDIR /app/Frontend
COPY ./Front/package*.json ./
RUN npm install
COPY ./Front ./
RUN npm run build

# Step 2: Build the Backend
FROM node:16 AS Backend-build
WORKDIR /app/Backend
COPY ./Back/package*.json ./
RUN npm install
COPY ./Back ./
RUN npm run build

# Step 3: Create the final combined image
FROM node:16
WORKDIR /app
# Copy the Frontend build output
COPY --from=Frontend-build /app/Frontend/build /app/Frontend
# Copy the Backend build output
COPY --from=Backend-build /app/Backend /app/Backend

# Expose necessary ports
EXPOSE 3000 5000

# Command to run both Frontend and Backend
CMD ["sh", "-c", "node /app/Backend/server.js & npx serve /app/Frontend -l 3000"]
