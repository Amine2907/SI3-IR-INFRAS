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
const getDevisRecuData = async (req, res) => {
    try {
        const result = await DashFiles.getDeviRecuWithSite();
        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        return res.status(200).json(result.data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller to generate and download Excel file
export const downloadExcel = async (req, res) => {
    try {
      const { type } = req.params; // Get the dynamic type from the URL
  
      let data;

      // Fetch the data based on the type
      if (type === 'drProduit') {
        data = await DashFiles.getDrDataWithSite();
      } else if (type === 'devisRecu') {
        data = await DashFiles.getDeviRecuWithSite();
        }  else if (type === 'devisEnAttente') {
            data = await DashFiles.getDevisEnAttenteWithSite();
        }  else if (type === 'devisEnAttenteOp') {
            data = await DashFiles.getDevisEnAttenteOpWithSite();
        } else if (type === 'devisSigne') {
                data = await DashFiles.getDevisSigneWithSite();
            } else if (type === 'reglementOk') {
                data = await DashFiles.getReglementOkWithSite();
             } else if (type === 'reglementAttente') {
                data = await DashFiles.getReglementEnAttenteWithSite();
             }else if (type === 'planificationExtension') {
                data = await DashFiles.getPlanificationExtension();
             }else if (type === 'extensionOk') {
                data = await DashFiles.getExtensionOk();
             } else if (type === 'planificationBranchement') {
                data = await DashFiles.getPlanificationBranchement();
             }else if (type === 'branchementOk') {
                data = await DashFiles.getBranchementOk();
            }else if (type === 'consuelRecu') {
                data = await DashFiles.getConsuelRecu();
            }else if (type === 'demandeMesRealisee') {
                data = await DashFiles.getDemMesRealisee();
            }else if (type === 'consuelEnAttente') {
                data = await DashFiles.getConsuelEnAttente();
            }else if (type === 'demandeMesEnAttente') {
                data = await DashFiles.getDemMesEnAttante();
             }else {
        return res.status(400).json({ message: 'Invalid type' });
      }
      // If fetching the data fails
      if (!data.success) {
        return res.status(500).json({ message: 'Error fetching data for the type' });
      }
  
      // Generate the Excel file
      const fileBuffer = DashFiles.generateExcelFile(data.data);
  
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

const DashFilesController = {
    getDrData,
    getDevisRecuData,
    downloadExcel,
}
export default DashFilesController;
