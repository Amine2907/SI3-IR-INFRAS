import fs from 'fs';
import path from 'path';
import moment from 'moment';
import ReportingGlobalModel from '../../models/ReportingGlobal/reportingModel.js';
import { supabase } from '../../config/supabaseClient.js';

// Contrôleur pour générer et télécharger un fichier Excel
const downloadExcel = async (req, res) => {
    try {
      const { type } = req.params;
      let data;
      if (type === 'reportingNormal') {
        data = await ReportingGlobalModel.getReportingData();
      } else {
        return res.status(400).json({ message: 'Type invalide' });
      } 
      
      if (!data.success) {
        return res.status(500).json({ message: 'Erreur lors de la récupération des données pour ce type' });
      }
  
      const fileBuffer = ReportingGlobalModel.generateExcelFile(data.data);
      res.setHeader('Content-Disposition', `attachment; filename=${type}_data.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      res.send(fileBuffer);
    } catch (error) {
      console.error('Erreur lors de la génération du fichier Excel :', error);
      res.status(500).json({ message: 'Erreur lors de la génération du fichier Excel', error: error.message });
    }
};

const generateReportManually = async (req, res) => {
    try {
        const data = await ReportingGlobalModel.getReportingData();

        if (!data.success) {
            console.error('Erreur lors de la récupération des données de reporting :', data.error);
            return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des données de reporting' });
        }
        
        const fileBuffer = ReportingGlobalModel.generateExcelFile(data.data);
        const timestamp = moment().format('YYYY-MM-DD_HH-mm');
        const fileName = `reporting_data_${timestamp}.xlsx`;

        const { error: uploadError } = await supabase.storage
            .from('reports')
            .upload(fileName, fileBuffer, {
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

        if (uploadError) {
            console.error('Erreur lors du téléversement du fichier sur Supabase :', uploadError);
            return res.status(500).json({ success: false, message: 'Erreur lors du téléversement du fichier' });
        }

        res.status(200).json({ success: true, message: 'Rapport généré avec succès', fileName });
    } catch (error) {
        console.error('Erreur lors de la génération du rapport manuel :', error.message);
        res.status(500).json({ success: false, message: 'Erreur lors de la génération du rapport manuel', error: error.message });
    }
};

const listReports = async (req, res) => {
    try {
        const { data, error } = await supabase.storage.from('reports').list('');

        if (error) {
            console.error('Erreur lors de la récupération des fichiers de Supabase :', error);
            return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rapports' });
        }

        const reports = data
            .filter((file) => file.name !== '.emptyFolderPlaceholder')
            .map((file) => ({
                name: file.name,
                url: `${process.env.SUPABASE_URL}/storage/v1/object/public/reports/${file.name}`,
            }));

        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error('Erreur lors de la liste des rapports :', error.message);
        res.status(500).json({ success: false, message: 'Erreur lors de la liste des rapports', error: error.message });
    }
};

const getSignedUrl = async (req, res) => {
    try {
        const { filename } = req.params;
        const { signedURL, error } = await supabase.storage
            .from('reports')
            .createSignedUrl(filename, 60 * 60);

        if (error) {
            console.error("Erreur lors de la génération de l'URL signée :", error);
            return res.status(500).json({ success: false, message: "Erreur lors de la génération de l'URL signée" });
        }

        res.status(200).json({ success: true, url: signedURL });
    } catch (error) {
        console.error("Erreur lors de la génération de l'URL signée :", error.message);
        res.status(500).json({ success: false, message: "Erreur lors de la génération de l'URL signée", error: error.message });
    }
};

const downloadFileController = async (req, res) => {
    try {
        const { filePath } = req.query;
        if (!filePath) {
            return res.status(400).json({ error: "Le chemin du fichier est requis" });
        }

        console.log("Chemin du fichier reçu :", filePath);

        const fileBlob = await ReportingGlobalModel.downloadExcel(filePath);

        if (!fileBlob) {
            return res.status(404).json({ error: "Fichier non trouvé" });
        }

        res.setHeader("Content-Disposition", `attachment; filename="${filePath.split('/').pop()}"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        const fileBuffer = await fileBlob.arrayBuffer();
        res.status(200).send(Buffer.from(fileBuffer));
    } catch (error) {
        console.error("Erreur dans downloadFileController :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
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
