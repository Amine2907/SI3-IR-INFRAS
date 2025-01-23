import fs from 'fs';
import path from 'path';
import ReportingGlobalModel from '../../models/ReportingGlobal/reportingModel.js';
import { supabase } from '../../config/supabaseClient.js';
// Controller to generate and download Excel file
export const downloadExcel = async (req, res) => {
    try {
      const { type } = req.params; // Get the dynamic type from the URL
  
      let data;
      // Fetch the data based on the type
      if (type === 'reportingNormal') {
        data = await ReportingGlobalModel.getReportingData();
      } else {
        return res.status(400).json({ message: 'Invalid type' });
      } 
      // If fetching the data fails
      if (!data.success) {
        return res.status(500).json({ message: 'Error fetching data for the type' });
      }
  
      // Generate the Excel file
      const fileBuffer = ReportingGlobalModel.generateExcelFile(data.data);
      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename=${type}_data.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      // Send the file buffer as response
      res.send(fileBuffer);
    } catch (error) {
      console.error('Error generating the Excel file:', error);
      res.status(500).json({ message: 'Error generating the Excel file', error: error.message });
    }
  };
  export const listReports = async (req, res) => {
    try {
        // Fetch files from the bucket
        const { data, error } = await supabase.storage.from('reports').list('');

        if (error) {
            console.error('Error fetching files from Supabase storage:', error);
            return res.status(500).json({ success: false, message: 'Error fetching reports' });
        }
        // Map the files to include public URLs
        const reports = data.map((file) => ({
            name: file.name,
            url: `${process.env.SUPABASE_URL}/storage/v1/object/public/reports/${file.name}`,
        }));
        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error('Error listing reports:', error.message);
        res.status(500).json({ success: false, message: 'Error listing reports', error: error.message });
    }
};
// Generate a signed URL for private buckets (optional)
export const getSignedUrl = async (req, res) => {
    try {
        const { filename } = req.params;

        // Generate a signed URL for the file
        const { signedURL, error } = await supabase.storage
            .from('reports')
            .createSignedUrl(filename, 60 * 60);

        if (error) {
            console.error('Error generating signed URL:', error);
            return res.status(500).json({ success: false, message: 'Error generating signed URL' });
        }

        res.status(200).json({ success: true, url: signedURL });
    } catch (error) {
        console.error('Error generating signed URL:', error.message);
        res.status(500).json({ success: false, message: 'Error generating signed URL', error: error.message });
    }
};
const ReportingController = {
    downloadExcel,
    listReports,
    getSignedUrl,
}
export default ReportingController;
