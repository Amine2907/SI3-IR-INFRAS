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
import cellStyle from '../../Styles/styles';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useDpsForProspects from './declpreaService';
import ProspectDpService from 'services/site_details/DP/DpService';
import DpUModal from 'examples/popup/DeclPreaPopUp/DpPopUp';
import MDAlert from 'components/MDAlert';
import DeclPraelStorageService from 'services/site_details/DP/dpStorageService';
import DpStorageModal from 'examples/popup/DpStoragePopUp';
import CommentSection from 'examples/Cards/Commentaires';
function DeclPreaList() {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selecteddp, setSelecteddp] = useState(null);
  const siteId = EB;
  const [site, setSite] = useState(null);
  const { dpsData, loading, error, fetchDpData } = useDpsForProspects(siteId);
  const handleEdit = dp => {
    setSelecteddp(dp);
    setShowModal(true);
  };
  const handleOpenModal = dp => {
    setSelecteddp(dp);
    setShowUploadModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowUploadModal(false);
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
    const DPid = selecteddp?.DPid;
    // console.log('Sending update for DPid:', DPid, 'Updates:', updates);
    if (!DPid) {
      console.error('DPid is missing, cannot update.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID de la DP est manquant.",
        type: 'error',
      });
      await fetchSiteDetails(siteId);
      return;
    }
    const { prospectName, ...filteredUpdates } = updates;
    try {
      const result = await ProspectDpService.updateDp(DPid, filteredUpdates);
      // console.log('API result:', result);
      let successMessage = '';
      if (result.success) {
        successMessage = 'DP modifiee avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchDpData();
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
        message: "Une erreur s'est produite lors de la mise à jour de la DP.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const fetchDeclPreaFiles = async declPreaId => {
    if (!declPreaId) {
      console.error('Prospect ID is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for prospect ID: ${declPreaId}`);
      const response = await DeclPraelStorageService.getDpFiles(declPreaId);
      if (response.success) {
        console.log('Files fetched successfully:', response.data.files);
        return response.data.files;
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
        <AlertDescription>Error: {String(error)}</AlertDescription>
      </Alert>
    );

  if (!dpsData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée des déclarations préalables pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );

  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{dpsData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>Nom Prospect</TableCell>
            <TableCell sx={cellStyle}>Numero DP</TableCell>
            <TableCell sx={cellStyle}>ANO Certificat Tacite</TableCell>
            <TableCell sx={cellStyle}>Arrete Opposition</TableCell>
            <TableCell sx={cellStyle}>Derniere Verification</TableCell>
            <TableCell sx={cellStyle}>Status Go Traveaux P</TableCell>
            <TableCell sx={cellStyle}>Status Go Traveaux R</TableCell>
            <TableCell sx={cellStyle}>Modifier</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {dpsData.map(dp => {
            return (
              <TableRow key={dp.id}>
                <TableCell>{dp.prospectName || 'N/A'}</TableCell>
                <TableCell>{dp.numero_DP || 'N/A'}</TableCell>
                <TableCell>{dp.ANO_certificat_tacite || 'N/A'}</TableCell>
                <TableCell>{dp.arrete_opposition || 'N/A'}</TableCell>
                <TableCell>{dp.derniere_verification || 'N/A'}</TableCell>
                <TableCell>{dp.status_go_traveauxP || 'N/A'}</TableCell>
                <TableCell>{dp.status_go_traveauxR || 'N/A'}</TableCell>
                <TableCell title="Modifier dp" placement="top">
                  <Icon sx={{ cursor: 'pointer' }} fontSize="small" onClick={() => handleEdit(dp)}>
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter DP " placement="top">
                  {' '}
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleOpenModal(dp)}
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
        <CommentSection entityName="DP" Sid={siteId} />
      </Box>
      {showModal && <DpUModal dp={selecteddp} onSave={handleUpdate} onClose={handleCloseModal} />}
      {showUploadModal && selecteddp?.DPid && (
        <DpStorageModal
          declPreaId={selecteddp?.DPid}
          fetchFiles={() => fetchDeclPreaFiles(selecteddp?.DPid)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchDeclPreaFiles();
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
DeclPreaList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default DeclPreaList;
