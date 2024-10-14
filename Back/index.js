import express from "express"; 
import cors from "cors"; 
import bodyParser from "body-parser";
// Routes
import authRoutes from './Routes/auth.js'; // Import auth routes
const dashboardRoutes = require('./Routes/dashboard.js'); // import dashboard routes
// Express Setup
const app = express();
app.use(cors({
}));
app.use(bodyParser.json());
app.use(express.json());
// Use Routes
app.use('/api/auth', authRoutes); 
app.get('/', (req, res) => {
    res.send('Hello World!');
  });
app.use('/api/dashboard', dashboardRoutes);
// Start Server
app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});