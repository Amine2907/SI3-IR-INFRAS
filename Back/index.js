/**
 * Main file for the Node.js server.
 * This file is the entry point for the server.
 * It imports the different routes and services, and sets up the Express app.
 * @license MIT
 * @fileoverview Main file for the Node.js server.
 */

// Imports
import express from "express"; 
import cors from "cors"; 
import bodyParser from "body-parser";

// Routes
import authRoutes from './Routes/auth.js';
import dashboardRoutes from './Routes/dashboard.js';
import entitiesRoutes from './Routes/entites.js'; // Corrected spelling from 'entites' to 'entities'
import contactsRoutes from './Routes/contacts.js';

// Export Services
export { default as contactService } from './services/contactsService.js';
export { default as authService } from './services/authService.js'; // Corrected export name for consistency
export { default as entityService } from './services/entityService.js';
export { default as settingsService } from './services/settingsService.js';

// Express Setup
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Use Routes
app.use('/api/auth', authRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/entities', entitiesRoutes); // Ensure the endpoint matches your route file
app.use('/api/contacts', contactsRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('SI3 BACKEND WORKING!');
});

// Start Server
const PORT = process.env.PORT || 5000; // Allow dynamic port allocation
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
