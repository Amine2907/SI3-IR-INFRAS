import cron from 'node-cron';
import moment from 'moment';
import { supabase } from './config/supabaseClient.js';
import ReportingGlobalModel from './models/ReportingGlobal/reportingModel.js';
cron.schedule('0 18 * * 5', async () => {
    console.log('Running scheduled task: Generating reporting data');
    try {
      // Step 1: Fetch reporting data
      console.log('Step 1: Fetching reporting data...');
      const data = await ReportingGlobalModel.getReportingData();
  
      if (!data.success) {
        console.error('Error fetching reporting data:', data.error);
        return;
      }
      console.log('Step 1: Reporting data fetched successfully.');
  
      // Step 2: Generate Excel file
      console.log('Step 2: Generating Excel file...');
      const fileBuffer = ReportingGlobalModel.generateExcelFile(data.data);
  
      // Generate a unique filename with timestamp
      const timestamp = moment().format('YYYY-MM-DD_HH-mm');
      const fileName = `reporting_data_${timestamp}.xlsx`;
      console.log(`Step 2: Excel file generated: ${fileName}`);
  
      // Step 3: Upload the file to Supabase storage
      console.log(`Step 3: Uploading file to Supabase: ${fileName}...`);
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, fileBuffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
  
      if (uploadError) {
        console.error('Error uploading file to Supabase storage:', uploadError);
      } else {
        console.log(`Step 3: File successfully uploaded to Supabase: ${fileName}`);
      }
    } catch (error) {
      console.error('Error during scheduled task:', error.message);
    }
  });
