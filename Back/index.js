import express from "express"; 
import cors from "cors"; 
import bodyParser from "body-parser";
// Routes
import authRoutes from './routes/auth.js'; // Import auth routes

// Express Setup
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(bodyParser.json());

// Use Routes
app.use('/api', authRoutes); 

// Start Server
app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
}); 