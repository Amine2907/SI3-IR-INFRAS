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
import useMesForSite from './mesService';
import siteMesService from 'services/site_details/MES/MesService';
import MesStorageModal from 'examples/popup/MesStoragePopUp';
import MesUModal from 'examples/popup/MesPopUp';
import mesStorageService from 'services/site_details/MES/MesStorageService';
import CommentSection from 'examples/Cards/Commentaires';
function MiseEnServiceList() {
  const [showModal, setShowModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedMes, setSelectedMes] = useState(null);
  const siteId = EB;
  const { mesData, loading, error, fetchMesData } = useMesForSite(siteId);
  const handleEdit = mes => {
    setSelectedMes(mes);
    setShowModal(true);
  };
  const handleUpload = mes => {
    setSelectedMes(mes);
    setShowStorageModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowStorageModal(false);
  };
  const handleUpdate = async updates => {
    const mesId = selectedMes?.MESid;
    console.log('Sending update for mesId:', mesId, 'Updates:', updates);
    if (!mesId) {
      console.error('mesId is missing, cannot update.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID de la mise en service est manquant.",
        type: 'error',
      });
      return;
    }
    try {
      const result = await siteMesService.updateMes(mesId, updates);
      let successMessage = '';
      if (result.success) {
        successMessage = 'mes modifiee avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchMesData();
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
        message: "Une erreur s'est produite lors de la mise à jour de mes.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const fetchMesFiles = async mesId => {
    if (!mesId) {
      console.error('Mise en Service ID is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for Mise en Service ID: ${mesId}`);
      const response = await mesStorageService.getMesFiles(mesId);
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
  const getDotColor = status_consuel => {
    if (status_consuel === 'En attente') return 'green';
    if (status_consuel === 'ok') return 'red';
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

  if (!mesData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée des mise en service pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );
  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{mesData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>No Pdl</TableCell>
            <TableCell sx={cellStyle}>Status consuel</TableCell>
            <TableCell sx={cellStyle}>Consuel remise</TableCell>
            <TableCell sx={cellStyle}>MES demande</TableCell>
            <TableCell sx={cellStyle}>MES (PREV) </TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {mesData.map(mes => {
            return (
              <TableRow key={mes.id}>
                <TableCell>{mes.no_PDL || 'N/A'}</TableCell>
                <TableCell>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: getDotColor(mes.status_consuel),
                    }}
                  />
                  {mes.status_consuel === undefined ? 'N/A' : ''}
                </TableCell>
                <TableCell>{mes.consuel_remise || 'N/A'}</TableCell>
                <TableCell>{mes.MES_demande || 'N/A'}</TableCell>
                <TableCell>{mes.MES_reel || 'N/A'}</TableCell>
                <TableCell title="Modifier mes" placement="top">
                  <Icon sx={{ cursor: 'pointer' }} fontSize="small" onClick={() => handleEdit(mes)}>
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter mes" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleUpload(mes)}
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
        <CommentSection entityName="MES" Sid={siteId} />
      </Box>
      {showModal && (
        <MesUModal
          Sid={siteId}
          mes={selectedMes}
          onSave={handleUpdate}
          onClose={handleCloseModal}
        />
      )}
      {showStorageModal && selectedMes?.MESid && (
        <MesStorageModal
          mesId={selectedMes?.MESid}
          fetchFiles={() => fetchMesFiles(selectedMes?.MESid)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchMesFiles();
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
MiseEnServiceList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default MiseEnServiceList;
