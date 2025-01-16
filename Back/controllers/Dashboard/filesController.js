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
const downloadDrExcel = async (req, res) => {
    try {
        const result = await DashFiles.getDrDataWithSite();
        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        // Generate Excel file from data
        const fileBuffer = generateExcelFile(result.data);

        // Set the response headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="dr_data.xlsx"');

        // Send the Excel file
        res.send(fileBuffer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
const DashFilesController = {
    getDrData,
    downloadDrExcel,
}
export default DashFilesController;
