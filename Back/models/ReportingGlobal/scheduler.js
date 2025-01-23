import cron from 'node-cron';
import moment from 'moment';
import { supabase } from './config/supabaseClient.js';
import ReportingGlobalModel from './models/ReportingGlobal/reportingModel.js';

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

        // Generate a unique filename with timestamp
        const timestamp = moment().format('YYYY-MM-DD_HH-mm');
        const fileName = `reporting_data_${timestamp}.xlsx`;

        // Upload the file to the Supabase storage bucket
        const { error: uploadError } = await supabase.storage
            .from('reports') 
            .upload(fileName, fileBuffer, {
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
        if (uploadError) {
            console.error('Error uploading file to Supabase storage:', uploadError);
        } else {
            console.log(`File successfully uploaded to Supabase: ${fileName}`);
        }
    } catch (error) {
        console.error('Error during scheduled task:', error.message);
    }
});
