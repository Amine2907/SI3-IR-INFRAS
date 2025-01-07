/* eslint-disable */
import React, { useState } from 'react';
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
import SiteDevisService from 'services/site_details/Devis/DevisService';
import useDevisForSite from './devisService';
import DevisUModal from 'examples/popup/DevisPopUp';
import devisStorageModal from 'examples/popup/DevisStoragePopUp';
import DevisStorageModal from 'examples/popup/DevisStoragePopUp';
function DevisList() {
  const [showModal, setShowModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedDevis, setSelectedDevis] = useState(null);
  const siteId = EB;
  const { devisData, loading, error, fetchdevisData } = useDevisForSite(siteId);
  const handleEdit = devis => {
    setSelectedDevis(devis);
    setShowModal(true);
  };
  const handleUpload = devis => {
    setSelectedDevis(devis);
    setShowStorageModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowStorageModal(false);
  };
  const handleUpdate = async updates => {
    const devisId = selectedDevis?.ND;
    console.log('Sending update for devisId:', devisId, 'Updates:', updates);
    if (!devisId) {
      console.error('devisId is missing, cannot update.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID de la devis est manquant.",
        type: 'error',
      });
      return;
    }
    const { fournisseurName, ...filteredUpdates } = updates;
    try {
      const result = await SiteDevisService.updateDevis(devisId, filteredUpdates);
      let successMessage = '';
      if (result.success) {
        successMessage = 'devis modifiee avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchdevisData();
        handleCloseModal();
      } else {
        setAlert({
          show: true,
          message: `Error: ${result.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur s'est produite lors de la mise à jour de  devis.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const getDotColor = conformite => {
    if (conformite === true) return 'green';
    if (conformite === false) return 'red';
    return 'gray';
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

  if (!devisData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Aucune donnée des devis pour ce site sont disponibles.</AlertDescription>
      </Alert>
    );
  const fetchDevisFiles = async devisId => {
    if (!devisId) {
      console.error('Devis ID is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for Devis ID: ${devisId}`);
      const response = await devisStorageModal.getDevisFiles(devisId); // Correct API call
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
  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{devisData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>No devis</TableCell>
            <TableCell sx={cellStyle}>Nom du forunisseur</TableCell>
            <TableCell sx={cellStyle}>Type de devis</TableCell>
            <TableCell sx={cellStyle}>Date de reception</TableCell>
            <TableCell sx={cellStyle}>Montant (TTC)</TableCell>
            <TableCell sx={cellStyle}>Conformite</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {devisData.map(devis => {
            return (
              <TableRow key={devis.id}>
                <TableCell>{devis.ND || 'N/A'}</TableCell>
                <TableCell>{devis.fournisseurName || 'N/A'}</TableCell>
                <TableCell>{devis.type_devis || 'N/A'}</TableCell>
                <TableCell>{devis.reception_date || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                      {devis.montant ? parseFloat(devis.montant).toFixed(2) : 'N/A'}
                    </Typography>
                    <Icon sx={{ fontSize: 'inherit', ml: 0.5 }}>euro</Icon>
                  </Box>
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: getDotColor(devis.conformite),
                    }}
                  />
                  {devis.conformite === undefined ? 'N/A' : ''}
                </TableCell>
                <TableCell title="Modifier devis" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(devis)}
                  >
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter devis" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleUpload(devis)}
                  >
                    add
                  </Icon>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </table>
      {showModal && (
        <DevisUModal
          Sid={siteId}
          devis={selectedDevis}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && selectedDevis?.ND && (
        <DevisStorageModal
          devisId={selectedDevis?.ND}
          fetchFiles={() => fetchDevisFiles(selectedDevis?.ND)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchDevisFiles();
          }}
          onClose={handleCloseModal}
        />
      )}
      {/* Display Alert if there's an error */}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={() => setAlert({ show: false })}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}
    </TableContainer>
  );
}
DevisList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default DevisList;
