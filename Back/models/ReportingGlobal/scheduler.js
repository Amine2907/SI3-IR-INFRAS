import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import ReportingGlobalModel from './models/ReportingGlobal/reportingModel.js';

// Scheduler for running every Friday at 6:00 PM
cron.schedule('0 18 * * 5', async () => {
    console.log('Running scheduled task: Generating reporting data');
    try {
        // Fetch reporting data
        const data = await ReportingGlobalModel.getReportingData();

        if (!data.success) {
            console.error('Error fetching reporting data:', data.error);
            return;
        }
        // Generate Excel file
        const fileBuffer = ReportingGlobalModel.generateExcelFile(data.data);
        const filePath = path.join(__dirname, 'scheduled_reports', 'reporting_data.xlsx');
        fs.writeFileSync(filePath, fileBuffer);
        console.log(`Excel file successfully generated at ${filePath}`);
    } catch (error) {
        console.error('Error during scheduled task:', error.message);
    }
});
console.log('Scheduler initialized');
