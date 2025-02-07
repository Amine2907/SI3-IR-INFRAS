import fs from 'fs';
import path from 'path';
import moment from 'moment';
import ReportingGlobalModel from '../../models/ReportingGlobal/reportingModel.js';
import { supabase } from '../../config/supabaseClient.js';
// Controller to generate and download Excel file
 const downloadExcel = async (req, res) => {
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
   const generateReportManually = async (req, res) => {
    try {
        // Fetch reporting data
        const data = await ReportingGlobalModel.getReportingData();

        if (!data.success) {
            console.error('Error fetching reporting data:', data.error);
            return res.status(500).json({ success: false, message: 'Error fetching reporting data' });
        }
        // Generate Excel file
        const fileBuffer = ReportingGlobalModel.generateExcelFile(data.data);
        // Generate a unique filename with timestamp
        const timestamp = moment().format('YYYY-MM-DD_HH-mm');
        const fileName = `reporting_data_${timestamp}.xlsx`;

        // Upload the file to the Supabase bucket
        const { error: uploadError } = await supabase.storage
            .from('reports')
            .upload(fileName, fileBuffer, {
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

        if (uploadError) {
            console.error('Error uploading file to Supabase storage:', uploadError);
            return res.status(500).json({ success: false, message: 'Error uploading file' });
        }

        res.status(200).json({ success: true, message: 'Report generated successfully', fileName });
    } catch (error) {
        console.error('Error generating report manually:', error.message);
        res.status(500).json({ success: false, message: 'Error generating report manually', error: error.message });
    }
};
const listReports = async (req, res) => {
    try {
        // Fetch files from the bucket
        const { data, error } = await supabase.storage.from('reports').list('');

        if (error) {
            console.error('Error fetching files from Supabase storage:', error);
            return res.status(500).json({ success: false, message: 'Error fetching reports' });
        }
        // Filter out .emptyFolderPlaceholder and map the files to include public URLs
        const reports = data
            .filter((file) => file.name !== '.emptyFolderPlaceholder')
            .map((file) => ({
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
 const getSignedUrl = async (req, res) => {
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
const downloadFileController = async (req, res) => {
    try {
        const { filePath } = req.query;
        if (!filePath) {
            return res.status(400).json({ error: "File path is required" });
        }

        console.log("Received file path:", filePath);

        // Get the file from Supabase
        const fileBlob = await ReportingGlobalModel.downloadExcel(filePath);

        if (!fileBlob) {
            return res.status(404).json({ error: "File not found" });
        }

        console.log("File blob type:", typeof fileBlob);
        console.log("File blob size:", fileBlob.size || 'unknown');

        // Correctly handle the file buffer and set headers
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filePath.split('/').pop()}"`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // Send the buffer to the client
        const fileBuffer = await fileBlob.arrayBuffer();
        res.status(200).send(Buffer.from(fileBuffer));
    } catch (error) {
        console.error("Error in downloadFileController:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const ReportingController = {
    downloadExcel,
    listReports,
    getSignedUrl,
    generateReportManually,
    downloadFileController,
}
export default ReportingController;
