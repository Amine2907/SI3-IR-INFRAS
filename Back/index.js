// Imports here 
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import http from 'http';
// Reporting Global Job 
import './cron-job.js';
// Routes
import authRoutes from './routes/Auth/auth.js';
import dashboardRoutes from './routes/Dashboard/dashboard.js';
import entitesRoutes from './routes/Entites/entites.js';
import contactsRoutes from './routes/Contacts/contacts.js';
import companiesRoutes from './routes/Companies/companies.js';
import settingsRoutes from './routes/Settings/settings.js';
import siteRoutes from './routes/Site/sites.js';
import siteContactRoutes from './routes/Site/sitescontacts.js';
import prospectRoutes from './routes/SiteDetails/Prospect/prospect.js';
import dpsRoutes from './routes/SiteDetails/DP/Dp.js';
import preEtudeRoutes from './routes/SiteDetails/PreEtude/preEtude.js';
import demRacRoutes from './routes/SiteDetails/DR/demRac.js';
import devisRoutes from './routes/SiteDetails/Devis/devis.js';
import factureRoutes from './routes/SiteDetails/Reglement/Facture/factures.js';
import traveauxRoutes from './routes/SiteDetails/Traveaux/traveaux.js';
import miseEnServiceRoutes from './routes/SiteDetails/MES/miseEnService.js';
import paieRoutes from './routes/SiteDetails/Reglement/Paiement/paiements.js';
import CommentsRoutes from './routes/Comments/comments.js';
import siteFields from './routes/Site/siteFields.js';
// Dasboard Routes
import dashRoutes from './routes/Dashboard/dashboard.js';
import dashCharts from './routes/Dashboard/dashCharts.js';
// Storing Routes
import prospectStorageRoutes from './routes/SiteDetails/Prospect/prospectStorage.js';
import demRacStorageRoutes from './routes/SiteDetails/DR/demRacStorage.js';
import preEtudeStorageRoutes from './routes/SiteDetails/PreEtude/preEtudeStorage.js';
import dpStorageRoutes from './routes/SiteDetails/DP/DpStorage.js';
import devisStorageRoutes from './routes/SiteDetails/Devis/devisStorage.js';
import paieStorageRoutes from './routes/SiteDetails/Reglement/Paiement/paieStorage.js';
import factureStorageRoutes from './routes/SiteDetails/Reglement/Facture/factureStorage.js';
import travStorageRoutes from './routes/SiteDetails/Traveaux/travsStorage.js';
import miseEnServiceStorageRoutes from './routes/SiteDetails/MES/mesStorage.js';
import checkFilesRoutes from './routes/SiteDetails/DynFields/getFilesRoute.js';
import dashFilesRoutes from './routes/Dashboard/dashFiles.js';
import reportingRoutes from './routes/ReportingGlobal/reporting.js';
// Express Setup
const app = express();
app.use(compression());
const allowedOrigins = [
  'https://si3-ir-infras.vercel.app',
  'https://si3-app.ir-infras.com'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
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
app.use('/api/site',siteRoutes);
app.use('/api/siteContact',siteContactRoutes);
app.use('/api/prospect',prospectRoutes);
app.use('/api/dps',dpsRoutes);
app.use('/api/preEtude',preEtudeRoutes);
app.use('/api/dem-rac',demRacRoutes);
app.use('/api/devis',devisRoutes);
app.use('/api/facture',factureRoutes);
app.use('/api/traveaux',traveauxRoutes);
app.use('/api/mes',miseEnServiceRoutes);
app.use('/api/paie',paieRoutes);
app.use('/api/coms',CommentsRoutes);
app.use('/api/site-fields',siteFields);
app.use('/api/dash',dashRoutes);
app.use('/api/dashCharts',dashCharts);
// Use Storing Routes
app.use('/api/dem-rac-storage',demRacStorageRoutes);
app.use('/api/dp-storage',dpStorageRoutes);
app.use('/api/pros-storage',prospectStorageRoutes);
app.use('/api/pre-storage',preEtudeStorageRoutes);
app.use('/api/devis-storage',devisStorageRoutes);
app.use('/api/trav-storage',travStorageRoutes);
app.use('/api/fac-storage',factureStorageRoutes);
app.use('/api/paie-storage',paieStorageRoutes);
app.use('/api/mes-storage',miseEnServiceStorageRoutes);
app.use('/api/check-files',checkFilesRoutes);
app.use('/api/dash-files',dashFilesRoutes);
app.use('/api/reporting-file',reportingRoutes);
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SI3 Backend</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
        }
        .container {
          text-align: center;
          padding: 20px;
          border: 2px solid #333;
          border-radius: 15px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #007BFF;
        }
        p {
          font-size: 1.2rem;
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SI3 Backend</h1>
        <p>Welcome to the SI3 backend! Everything is running smoothly.</p>
      </div>
    </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});
// Server with Keep-Alive
const server = http.createServer(app);
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 130 * 1000;
// Start Server
const PORT = process.env.PORT || 5000  ;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});