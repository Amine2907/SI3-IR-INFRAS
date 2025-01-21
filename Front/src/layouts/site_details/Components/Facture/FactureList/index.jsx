/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  TableContainer,
  TableCell,
  TableRow,
  Box,
  Typography,
  TableBody,
  Icon,
} from '@mui/material';
import { Alert, AlertDescription } from 'components/ui/alert';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import MDAlert from 'components/MDAlert';
import cellStyle from './styles/styles';
import usefactureForSite from './factureService';
import CommentSection from 'examples/Cards/Commentaires';
import siteFactureService from 'services/site_details/Reglement/Facture/FactureService';
import FactureUModal from 'examples/popup/FacturePopUp';
import facStorageService from 'services/site_details/Reglement/Facture/FactStorageService';
import FactureStorageModal from 'examples/popup/FactureStoragePopUp';
function FactureList() {
  const [showModal, setShowModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, facturesage: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedFacture, setSelectedFacture] = useState(null);
  const siteId = EB;
  const { factureData, loading, error, fetchFatureData } = usefactureForSite(siteId);
  const handleEdit = facture => {
    setSelectedFacture(facture);
    setShowModal(true);
  };
  const handleUpload = facture => {
    setSelectedFacture(facture);
    setShowStorageModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowStorageModal(false);
  };
  const handleCloseAlert = () => {
    setTimeout(() => {
      setAlert({ show: false, facturesage: '', type: '' });
    }, 10000); // Auto-dismiss after 10 seconds
  };
  useEffect(() => {
    if (alert.show) {
      handleCloseAlert();
    }
  }, [alert.show]);
  const handleUpdate = async updates => {
    const factureId = selectedFacture?.factureId;
    console.log('Sending update for factureId:', factureId, 'Updates:', updates);
    if (!factureId) {
      console.error('factureId is missing, cannot update.');
      setAlert({
        show: true,
        facturesage: "Une erreur s'est produite : l'ID de la mise en service est manquant.",
        type: 'error',
      });
      return;
    }
    try {
      const result = await siteFactureService.updateFacture(factureId, updates);
      let successfacturesage = '';
      if (result.success) {
        successfacturesage = 'facture modifiee avec succès !';
        setAlert({ show: true, facturesage: successfacturesage, type: 'success' });
        fetchFatureData();
        handleCloseModal();
      } else {
        setAlert({
          show: true,
          facturesage: `Error: ${result.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        facturesage: "Une erreur s'est produite lors de la mise à jour de facture.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const fetchfactureFiles = async factureId => {
    if (!factureId) {
      console.error('Facture ID is missing!');
      return [];
    }
    if (!siteId) {
      console.error('Site id  is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for Mise en Service ID: ${factureId}`);
      const response = await facStorageService.getFactureFiles(factureId, siteId);
      if (response.success) {
        console.log('Files fetched successfully:', response.data.files);
        return response.data.files; // Return the fetched files
      } else {
        console.error('Error fetching files:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  };
  if (loading)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Chargement...</AlertDescription>
      </Alert>
    );
  if (error)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Erreur: {String(error)}</AlertDescription>
      </Alert>
    );

  if (!factureData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée de factures pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );
  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{factureData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>No Facture</TableCell>
            <TableCell sx={cellStyle}>No Devis</TableCell>
            <TableCell sx={cellStyle}>Date Facture</TableCell>
            <TableCell sx={cellStyle}>Montant (HT)</TableCell>
            <TableCell sx={cellStyle}>Montant (TTC) </TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {factureData.map(facture => {
            return (
              <TableRow key={facture.id}>
                <TableCell>{facture.no_fac || 'N/A'}</TableCell>
                <TableCell>{facture.Dfk || 'N/A'}</TableCell>
                <TableCell>{facture.facture_date || 'N/A'}</TableCell>
                <TableCell>{facture.montant_ht || 'N/A'}</TableCell>
                <TableCell>{facture.montant_ttc || 'N/A'}</TableCell>
                <TableCell title="Modifier facture" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(facture)}
                  >
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter facture" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleUpload(facture)}
                  >
                    add
                  </Icon>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </table>
      <Box mt={4}>
        <CommentSection entityName="Facture" Sid={siteId} />
      </Box>
      {showModal && (
        <FactureUModal
          Sid={siteId}
          facture={selectedFacture}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && selectedFacture?.factureId && (
        <FactureStorageModal
          Sid={siteId}
          factureId={selectedFacture?.factureId}
          fetchFiles={() => fetchfactureFiles(selectedFacture?.factureId)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchfactureFiles();
          }}
          onClose={handleCloseModal}
        />
      )}
      {/* Display Alert if there's an error */}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={() => setAlert({ show: false })} // Manual close
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.facturesage}
        </MDAlert>
      )}
    </TableContainer>
  );
}
FactureList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default FactureList;
