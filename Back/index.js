/**
 * Main file for the Node.js server.
 * This file is the entry point for the server.
 * It imports the different routes and services, and sets up the Express app.
 * @license MIT
 * @fileoverview Main file for the Node.js server.
 */
// Imports here 
import express from "express"; 
import cors from "cors"; 
import bodyParser from "body-parser";
// Routes
import authRoutes from './Routes/auth.js';
import dashboardRoutes from './Routes/dashboard.js';
import entitesRoutes from './Routes/entites.js';
import contactsRoutes from './Routes/contacts.js';
// Exports here 
export { default as contactService } from './services/contactsService.js';
export { default as AuthService } from './services/authService.js';
export { default as entityService } from './services/entityService.js';
export { default as settingsService } from './services/settingsService.js';
// Express Setup
const app = express();
app.use(cors({
}));
app.use(bodyParser.json());
app.use(express.json());
// Use Routes
app.use('/api/auth', authRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/entites',entitesRoutes);
app.use('/api/contacts',contactsRoutes);
app.get('/', (req, res) => {
    res.send('SI3 BACKEND WORKING !');
  });
// Start Server
app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});