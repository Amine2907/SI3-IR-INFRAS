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
import useTravForSite from './traveauxService';
import siteTravService from 'services/site_details/Traveaux/TraveauxService';
import TravStorageModal from 'examples/popup/TravStoragePopUp';
import TravUModal from 'examples/popup/TraveauxPopUp';
import cellStyle from './styles/styles';
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
      {showModal && (
        <TravUModal
          Sid={siteId}
          traveaux={selectedTrav}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && (
        <TravStorageModal
          traveaux={selectedTrav}
          onSave={handleUpdate}
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
TraveauxList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default TraveauxList;
