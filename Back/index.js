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
import companiesRoutes from './Routes/companies.js';
import settingsRoutes from './Routes/settings.js'
// import UsersRoutes from './Routes/getUsers.js';
// Exports here 
export { default as contactService } from './services/contactsService.js';
export { default as AuthService } from './services/authService.js';
export { default as entityService } from './services/entityService.js';
export { default as settingsService } from './services/settingsService.js';
// Express Setup
const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Use Routes
app.use('/api/auth', authRoutes); 
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/entites',entitesRoutes);
app.use('/api/contacts',contactsRoutes);
app.use('/api/companies',companiesRoutes);
app.use('/api/settings',settingsRoutes);
app.get('/', (req, res) => {
    res.send('SI3 BACKEND WORKING !');
  });
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Start Server
app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});