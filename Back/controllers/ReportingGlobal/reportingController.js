import fs from 'fs';
import path from 'path';
import ReportingGlobalModel from '../../models/ReportingGlobal/reportingModel.js';
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
const ReportingController = {
    downloadExcel,
}
export default ReportingController;
