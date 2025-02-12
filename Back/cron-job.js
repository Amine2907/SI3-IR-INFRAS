import cron from 'node-cron';
import moment from 'moment';
import { supabase } from './config/supabaseClient.js';
import ReportingGlobalModel from './models/ReportingGlobal/reportingModel.js';
// cron.schedule('* * * * *', async () => {
// Scheduling job: Monday - Friday at 19:30
cron.schedule('30 19 * * 1-5', async () => {
  console.log('Running scheduled task: Generating reporting data');
  
  // Start measuring total execution time
  const totalStart = process.hrtime();

  try {
    // Step 1: Fetch reporting data
    console.log('Step 1: Fetching reporting data...');
    const fetchStart = process.hrtime();
    
    const data = await ReportingGlobalModel.getReportingData();
    
    const fetchEnd = process.hrtime(fetchStart);
    console.log(`✅ Step 1: Reporting data fetched successfully in ${fetchEnd[0]}s ${fetchEnd[1] / 1e6}ms`);

    if (!data.success) {
      console.error('❌ Error fetching reporting data:', data.error);
      return;
    }

    // Step 2: Generate Excel file
    console.log('Step 2: Generating Excel file...');
    const generateStart = process.hrtime();
    
    const fileBuffer = ReportingGlobalModel.generateExcelFile(data.data);
    
    const generateEnd = process.hrtime(generateStart);
    console.log(`✅ Step 2: Excel file generated in ${generateEnd[0]}s ${generateEnd[1] / 1e6}ms`);

    // Generate a unique filename with timestamp
    const timestamp = moment().format('YYYY-MM-DD_HH-mm');
    const fileName = `reporting_data_${timestamp}.xlsx`;

    // Step 3: Upload the file to Supabase storage
    console.log(`Step 3: Uploading file to Supabase: ${fileName}...`);
    const uploadStart = process.hrtime();
    
    const { error: uploadError } = await supabase.storage
      .from('reports')
      .upload(fileName, fileBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

    const uploadEnd = process.hrtime(uploadStart);
    if (uploadError) {
      console.error('❌ Error uploading file to Supabase storage:', uploadError);
    } else {
      console.log(`✅ Step 3: File successfully uploaded in ${uploadEnd[0]}s ${uploadEnd[1] / 1e6}ms`);
    }

  } catch (error) {
    console.error('❌ Error during scheduled task:', error.message);
  }

  // Log total execution time
  const totalEnd = process.hrtime(totalStart);
  console.log(`Total execution time: ${totalEnd[0]}s ${totalEnd[1] / 1e6}ms`);
});

console.log(' Cron job for reporting is scheduled.');
