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
import useTravForSite from './traveauxService';
import siteTravService from 'services/site_details/Traveaux/TraveauxService';
import TravUModal from 'examples/popup/TraveauxPopUp';
import cellStyle from './styles/styles';
import TravStorageModal from 'examples/popup/TravStoragePopUp';
import travStorageService from 'services/site_details/Traveaux/TravStorageService';
import CommentSection from 'examples/Cards/Commentaires';
function TraveauxList() {
  const [showModal, setShowModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedTrav, setSelectedTrav] = useState(null);
  const siteId = EB;
  const { traveauxData, loading, error, fecthTravData } = useTravForSite(siteId);
  const handleEdit = traveaux => {
    setSelectedTrav(traveaux);
    setShowModal(true);
  };
  const handleUpload = traveaux => {
    setSelectedTrav(traveaux);
    setShowStorageModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowStorageModal(false);
  };
  const handleCloseAlert = () => {
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 10000); // Auto-dismiss after 10 seconds
  };
  useEffect(() => {
    if (alert.show) {
      handleCloseAlert();
    }
  }, [alert.show]);
  const handleUpdate = async updates => {
    const travId = selectedTrav?.Tid;
    console.log('Sending update for travId:', travId, 'Updates:', updates);
    if (!travId) {
      console.error('travId is missing, cannot update.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID de la traveau est manquant.",
        type: 'error',
      });
      return;
    }
    try {
      const result = await siteTravService.updateTrav(travId, updates);
      let successMessage = '';
      if (result.success) {
        successMessage = 'traveaux modifiee avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fecthTravData();
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
        message: "Une erreur s'est produite lors de la mise à jour de  traveaux.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const fetchTravFiles = async travId => {
    if (!travId) {
      console.error('Trav ID is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for prospect ID: ${travId}`);
      const response = await travStorageService.getTavFiles(travId, siteId); // Correct API call
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

  if (!traveauxData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée des traveaux pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );
  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{traveauxData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>Id Traveaux</TableCell>
            <TableCell sx={cellStyle}>Extension (Prev)</TableCell>
            <TableCell sx={cellStyle}>Extension (Reel)</TableCell>
            <TableCell sx={cellStyle}>Branchement (Prev)</TableCell>
            <TableCell sx={cellStyle}>Branchement (Reel)</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {traveauxData.map(traveaux => {
            return (
              <TableRow key={traveaux.id}>
                <TableCell>{traveaux.Tid || 'N/A'}</TableCell>
                <TableCell>{traveaux.extension_prev || 'N/A'}</TableCell>
                <TableCell>{traveaux.extension_reel || 'N/A'}</TableCell>
                <TableCell>{traveaux.branchement_prev || 'N/A'}</TableCell>
                <TableCell>{traveaux.branchement_reel || 'N/A'}</TableCell>
                <TableCell title="Modifier traveaux" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(traveaux)}
                  >
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter traveaux" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleUpload(traveaux)}
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
        <CommentSection entityName="Traveaux" Sid={siteId} />
      </Box>
      {showModal && (
        <TravUModal
          Sid={siteId}
          traveaux={selectedTrav}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && selectedTrav?.Tid && (
        <TravStorageModal
          Sid={siteId}
          travId={selectedTrav?.Tid}
          fetchFiles={() => fetchTravFiles(selectedTrav?.Tid)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchTravFiles();
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
          {alert.message}
        </MDAlert>
      )}
    </TableContainer>
  );
}
TraveauxList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default TraveauxList;
