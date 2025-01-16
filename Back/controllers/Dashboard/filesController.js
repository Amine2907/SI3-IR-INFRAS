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
      // Fetch data to be included in the Excel file (example: 'DR' table data)
      const drData = await getDrData();
  
      // Convert data to Excel format
      const ws = writeFile(drData, { bookType: 'xlsx', type: 'buffer' });
  
      // Set headers to indicate a file download
      res.setHeader('Content-Disposition', 'attachment; filename=dr_produit.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      // Send the file as the response
      res.send(ws);
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
