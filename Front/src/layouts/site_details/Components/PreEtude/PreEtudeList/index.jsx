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
import SitePreEtudeService from 'services/site_details/PreEtude/preEtudeService';
import MDAlert from 'components/MDAlert';
import cellStyle from './styles/styles';
import usepreEtudesForSite from './preEtdueService';
import PreEtModal from 'examples/popup/PreEtudePopUp';
import PreEtudeStorageModal from 'examples/popup/PreEtudeStoragePopUp';
import preEtudeStorageService from 'services/site_details/PreEtude/preEtudeStorageService';
import CommentSection from 'examples/Cards/Commentaires';
function PreEtudeList() {
  const [showModal, setShowModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedpreEtude, setSelectedpreEtude] = useState(null);
  const siteId = EB;
  const { preEtudeData, loading, error, fetchPreEtudeData } = usepreEtudesForSite(siteId);
  const handleEdit = preEtude => {
    setSelectedpreEtude(preEtude);
    setShowModal(true);
    setIsModalOpen(true);
  };
  // Opening the modal for file upload (ensure prospectId is available)
  const handleOpenModal = preEtude => {
    setSelectedpreEtude(preEtude);
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
    const preEtudeid = selectedpreEtude?.PREid;
    console.log('Sending update for preEtudeid:', preEtudeid, 'Updates:', updates);
    if (!preEtudeid) {
      console.error('preEtudeid is missing, cannot update.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID de la preEtude est manquant.",
        type: 'error',
      });
      return;
    }
    const { prospectName, ...filteredUpdates } = updates;
    try {
      const result = await SitePreEtudeService.updatePreEtude(preEtudeid, filteredUpdates);
      let successMessage = '';
      if (result.success) {
        successMessage = 'preEtude modifiee avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchPreEtudeData();
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
        message: "Une erreur s'est produite lors de la mise à jour de la preEtude.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const fetchPreEtudeFiles = async preEtudeId => {
    if (!preEtudeId) {
      console.error('preEtude ID is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for preEtude ID: ${preEtudeId}`);
      const response = await preEtudeStorageService.getPreEtudeFiles(preEtudeId, siteId); // Correct API call
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
  const getDotColor = type_rac => {
    if (type_rac === 'Simple') return 'green';
    if (type_rac === 'Complexe') return 'red';
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

  if (!preEtudeData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée des pre-etude pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );
  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{preEtudeData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>Nom Prospect</TableCell>
            <TableCell sx={cellStyle}>Type de raccordement</TableCell>
            <TableCell sx={cellStyle}>Cout</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {preEtudeData.map(preEtude => {
            return (
              <TableRow key={preEtude.id}>
                <TableCell>{preEtude.prospectName || 'N/A'}</TableCell>
                <TableCell>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: getDotColor(preEtude.type_rac),
                    }}
                  />
                  {preEtude.type_rac === undefined ? 'N/A' : ''}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'normal' }}>
                      {preEtude.cout ? parseFloat(preEtude.cout).toFixed(2) : 'N/A'}
                    </Typography>
                    <Icon sx={{ fontSize: 'inherit', ml: 0.5 }}>euro</Icon>
                  </Box>
                </TableCell>
                <TableCell title="Modifier preEtude" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(preEtude)}
                  >
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter preEtude" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleOpenModal(preEtude)}
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
        <CommentSection entityName="PreEtude" Sid={siteId} />
      </Box>
      {showModal && (
        <PreEtModal
          Sid={siteId}
          preEtude={selectedpreEtude}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && selectedpreEtude?.PREid && (
        <PreEtudeStorageModal
          Sid={siteId}
          preEtudeId={selectedpreEtude?.PREid}
          fetchFiles={() => fetchPreEtudeFiles(selectedpreEtude?.PREid)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchPreEtudeFiles();
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
PreEtudeList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default PreEtudeList;
