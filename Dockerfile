# Step 1: Build the frontend
FROM node:16 AS frontend-build
WORKDIR /app/frontend
COPY ./front/package*.json ./
RUN npm install
COPY ./front ./
RUN npm run build

# Step 2: Build the backend
FROM node:16 AS backend-build
WORKDIR /app/backend
COPY ./back/package*.json ./
RUN npm install
COPY ./back ./
RUN npm run build

# Step 3: Create the final combined image
FROM node:16
WORKDIR /app
# Copy the frontend build output
COPY --from=frontend-build /app/frontend/build /app/frontend
# Copy the backend build output
COPY --from=backend-build /app/backend /app/backend

# Expose necessary ports
EXPOSE 3000 5000

# Command to run both frontend and backend
CMD ["sh", "-c", "node /app/backend/server.js & npx serve /app/frontend -l 3000"]
