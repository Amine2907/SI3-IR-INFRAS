import DashFiles from '../../models/Dashboard/filesModel.js';
import fs from 'fs';
import path from 'path';

// Controller to get DR data with Site data
const getDrData = async (req, res) => {
    try {
        const result = await DashFiles.getDrDataWithSite();
        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller to generate and download Excel file
export const downloadDrExcel = async (req, res) => {
    try {
      // Fetch the DR data
      const drDataResult = await DashFiles.getDrDataWithSite();
  
      if (!drDataResult.success) {
        return res.status(500).json({ message: 'Error fetching DR data' });
      }
  
      // Generate the Excel file using the data
      const fileBuffer = DashFiles.generateExcelFile(drDataResult.data);
  
      // Set headers for file download
      res.setHeader('Content-Disposition', 'attachment; filename=dr_produit.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      // Send the file buffer as response
      res.send(fileBuffer);
    } catch (error) {
      console.error('Error generating the Excel file:', error);
      res.status(500).json({ message: 'Error generating the Excel file', error: error.message });
    }
  };
const DashFilesController = {
    getDrData,
    downloadDrExcel,
}
export default DashFilesController;
