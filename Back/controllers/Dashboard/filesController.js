import DashFiles from '../../models/Dashboard/filesModel.js';
import fs from 'fs';
import path from 'path';

// Contrôleur pour générer et télécharger un fichier Excel
export const downloadExcel = async (req, res) => {
    try {
      const { type } = req.params;
      let data;
      // Récupérer les données en fonction du type
        if (type === 'drProduit') {
            data = await DashFiles.getDrDataWithSite();
        } else if (type === 'devisRecu') {
            data = await DashFiles.getDeviRecuWithSite();
        } else if (type === 'devisEnAttente') {
            data = await DashFiles.getDevisEnAttenteWithSite();
        } else if (type === 'devisEnAttenteOp') {
            data = await DashFiles.getDevisEnAttenteOpWithSite();
        } else if (type === 'devisSigne') {
            data = await DashFiles.getDevisSigneWithSite();
        } else if (type === 'reglementOk') {
            data = await DashFiles.getReglementOkWithSite();
        } else if (type === 'reglementAttente') {
            data = await DashFiles.getReglementEnAttenteWithSite();
        } else if (type === 'planificationExtension') {
            data = await DashFiles.getPlanificationExtension();
        } else if (type === 'extensionOk') {
            data = await DashFiles.getExtensionOk();
        } else if (type === 'planificationBranchement') {
            data = await DashFiles.getPlanificationBranchement();
        } else if (type === 'branchementOk') {
            data = await DashFiles.getBranchementOk();
        } else if (type === 'consuelRecu') {
            data = await DashFiles.getConsuelRecu();
        } else if (type === 'demandeMesRealisee') {
            data = await DashFiles.getDemMesRealisee();
        } else if (type === 'consuelEnAttente') {
            data = await DashFiles.getConsuelEnAttente();
        } else if (type === 'demandeMesEnAttente') {
            data = await DashFiles.getDemMesEnAttante();
        } else {
            return res.status(400).json({ message: 'Type invalide' });
        } 
      
      // Si la récupération des données échoue
      if (!data.success) {
        return res.status(500).json({ message: 'Erreur lors de la récupération des données pour ce type' });
      }
  
      // Générer le fichier Excel
      const fileBuffer = DashFiles.generateExcelFile(data.data);
  
      // Définir les en-têtes pour le téléchargement du fichier
      res.setHeader('Content-Disposition', `attachment; filename=${type}_data.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      // Envoyer le fichier en réponse
      res.send(fileBuffer);
    } catch (error) {
      console.error('Erreur lors de la génération du fichier Excel :', error);
      res.status(500).json({ message: 'Erreur lors de la génération du fichier Excel', error: error.message });
    }
  };

const DashFilesController = {
    downloadExcel,
}
export default DashFilesController;
