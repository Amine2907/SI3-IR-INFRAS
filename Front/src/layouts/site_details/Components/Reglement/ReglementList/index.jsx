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
import DevisStorageModal from 'examples/popup/DevisStoragePopUp';
function ReglementList() {
  const [showModal, setShowModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedRegl, setselectedRegl] = useState(null);
  const siteId = EB;
  const { reglementData, loading, error, fetchreglementData } = useDevisForSite(siteId);
  const handleEdit = devis => {
    setselectedRegl(devis);
    setShowModal(true);
  };
  const handleUpload = devis => {
    setselectedRegl(devis);
    setShowStorageModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowStorageModal(false);
  };
  const handleUpdate = async updates => {
    const reglId = selectedRegl?.Pid;
    console.log('Sending update for reglId:', reglId, 'Updates:', updates);
    if (!reglId) {
      console.error('reglId is missing, cannot update.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID de la devis est manquant.",
        type: 'error',
      });
      return;
    }
    const { fournisseurName, ...filteredUpdates } = updates;
    try {
      if (fournisseur && fournisseur.nom) {
        filteredUpdates.fournisseur_id = fournisseur.id; // Assuming 'id' is the supplier ID
      }
      const result = await SiteDevisService.updateDevis(reglId, filteredUpdates);
      let successMessage = '';
      if (result.success) {
        successMessage = 'devis modifiee avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchreglementData();
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

  if (!reglementData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée des reglements pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );
  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{reglementData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>No Virement</TableCell>
            <TableCell sx={cellStyle}>Nom acteur</TableCell>
            <TableCell sx={cellStyle}>Montant Paiement</TableCell>
            <TableCell sx={cellStyle}>Date de reglement</TableCell>
            <TableCell sx={cellStyle}>Libelle du virement</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {reglementData.map(devis => {
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
          devis={selectedRegl}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && (
        <DevisStorageModal devis={selectedRegl} onSave={handleUpdate} onClose={handleCloseModal} />
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
ReglementList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default ReglementList;
