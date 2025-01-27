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
import useReglForSite from './reglementService';
import sitePaiementService from 'services/site_details/Reglement/Paiement/PaiementService';
import PaieUModal from 'examples/popup/ReglementPopUp';
import paieStorageService from 'services/site_details/Reglement/Paiement/PaieStorageService';
import PaieStorageModal from 'examples/popup/ReglStoragePopUp';
import CommentSection from 'examples/Cards/Commentaires';
function ReglementList() {
  const [showModal, setShowModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedPaie, setSelectedPaie] = useState(null);
  const siteId = EB;
  const { paiementData, loading, error, fetchPaiementData } = useReglForSite(siteId);
  const handleEdit = paiement => {
    setSelectedPaie(paiement);
    setShowModal(true);
  };
  const handleUpload = paiement => {
    setSelectedPaie(paiement);
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
    const reglId = selectedPaie?.Pid;
    console.log('Sending update for reglId:', reglId, 'Updates:', updates);
    if (!reglId) {
      console.error('reglId is missing, cannot update.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID de la paiement est manquant.",
        type: 'error',
      });
      return;
    }
    try {
      const result = await sitePaiementService.updatePaie(reglId, updates);
      let successMessage = '';
      if (result.success) {
        successMessage = 'paiement modifiee avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchPaiementData();
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
        message: "Une erreur s'est produite lors de la mise à jour de  paiement.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const fetchPaieFiles = async paieId => {
    if (!paieId) {
      console.error('Prospect ID is missing!');
      return [];
    }
    if (!siteId) {
      console.error('Site id  is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for prospect ID: ${paieId}`);
      const response = await paieStorageService.getPaieFiles(paieId, siteId); // Correct API call
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

  if (!paiementData.length)
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
        <Typography variant="h6">{paiementData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>No Virement</TableCell>
            <TableCell sx={cellStyle}>Nom acteur</TableCell>
            <TableCell sx={cellStyle}>Montant (TTC)</TableCell>
            <TableCell sx={cellStyle}>Date de reglement</TableCell>
            <TableCell sx={cellStyle}>Libelle du virement</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {paiementData.map(paiement => {
            return (
              <TableRow key={paiement.id}>
                <TableCell>{paiement.no_virement || 'N/A'}</TableCell>
                <TableCell>{paiement.nom_acteur || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                      {paiement.montant ? parseFloat(paiement.montant).toFixed(2) : 'N/A'}
                    </Typography>
                    <Icon sx={{ fontSize: 'inherit', ml: 0.5 }}>euro</Icon>
                  </Box>
                </TableCell>
                <TableCell>{paiement.reglement_date || 'N/A'}</TableCell>
                <TableCell>{paiement.libelle_du_virement || 'N/A'}</TableCell>
                <TableCell title="Modifier paiement" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(paiement)}
                  >
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter paiement" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleUpload(paiement)}
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
        <CommentSection entityName="Paiements" Sid={siteId} />
      </Box>
      {showModal && (
        <PaieUModal
          Sid={siteId}
          paiement={selectedPaie}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && selectedPaie?.Pid && (
        <PaieStorageModal
          paieId={selectedPaie?.Pid}
          fetchFiles={() => fetchPaieFiles(selectedPaie?.Pid)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchPaieFiles();
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
ReglementList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default ReglementList;
