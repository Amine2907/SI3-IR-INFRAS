/* eslint-disable */
import React, { useEffect, useState } from 'react';
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
import MDAlert from 'components/MDAlert';
import useProspectsData from './prospectService';
import cellStyle from '../../Styles/styles';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import CombinedModal from 'examples/popup/PropsectDpPopUp/CombinedPopUp';
import ProspectDpService from 'services/site_details/DP/DpService';
import { statusValidationValues } from './ProspectData';
import useDpsForProspects from '../DeclPreal/declpreaService';
import ProspectStorageModal from 'examples/popup/PropsectStoragePopUp';
import ProspectStorageService from 'services/site_details/Prospect/prospectStorageService';
function ProspectList({ site }) {
  const { prospectsData, loading, error, fetchProspectsData } = useProspectsData(site);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedprospect, setSelectedprospect] = useState(null);
  const [selectedDp, setSelectedDp] = useState(null);
  const Sid = EB;
  const Proid = selectedprospect?.Proid;
  const { fetchDpData } = useDpsForProspects(Sid);
  const handleEdit = prospect => {
    setSelectedprospect(prospect);
    setShowModal(true);
    setIsModalOpen(true);
  };
  // Opening the modal for file upload (ensure prospectId is available)
  const handleOpenModal = prospect => {
    setSelectedprospect(prospect);
    setShowUploadModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowUploadModal(false);
  };
  useEffect(() => {
    if (prospectsData && prospectsData.length > 0) {
      console.log('Prospects Data:', prospectsData);
      prospectsData.forEach(prospect => {
        console.log('Status Validation FK:', prospect.status_validation_fk);
      });
    }
  }, [prospectsData]);
  useEffect(() => {
    if (Sid) {
      fetchProspectsData();
    }
  }, [site, fetchProspectsData]);
  // update a site's prospect
  const handleUpdate = async updates => {
    const Proid = selectedprospect?.Proid;
    console.log('Sending request with Proid:', Proid);
    console.log('Form Data:', updates);
    if (!Proid) {
      console.error('Le Proid est manquant, impossible de mettre à jour.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID du prospect est manquant.",
        type: 'error',
      });
      return;
    }
    try {
      const result = await SiteProspectService.updateProspect(Proid, updates);
      console.log('API result:', result);
      if (result.success) {
        setAlert({
          show: true,
          message: 'Prospect modifié avec succès !',
          type: 'success',
        });
        fetchProspectsData();
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
        message: "Une erreur s'est produite lors de l'enregistrement du prospect.",
        type: 'error',
      });
    }
    handleCloseModal(); // Close the modal after save
  };
  // handle add a DP to a Prospect
  const handleSaveDp = async data => {
    const { dpData } = data;
    try {
      // Create new DP
      const result = await ProspectDpService.createDp({ Sid, Proid, dpData });
      // console.log('API result:', result); // Log the API response for debugging
      let successMessage = '';
      if (result.success) {
        successMessage = 'Déclaration Préalable enregistrée avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchDpData();
      } else {
        let errorMessage = `Error: ${result.error}`;
        if (result.error.includes('A DP with active status already exists for this site')) {
          errorMessage = 'Il y a déjà une déclaration préalable active pour ce prospect.';
        }
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur s'est produite lors de l'enregistrement de la déclaration préalable.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  const getDotColor = retenu => {
    if (retenu === true) return 'green';
    if (retenu === false) return 'red';
    return 'gray';
  };
  const fetchProspectFiles = async prospectId => {
    if (!prospectId) {
      console.error('Prospect ID is missing!');
      return [];
    }
    try {
      console.log(`Fetching files for prospect ID: ${prospectId}`);
      const response = await ProspectStorageService.getProspectFiles(prospectId); // Correct API call
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
        <AlertDescription>Error: {String(error)}</AlertDescription>
      </Alert>
    );

  if (!prospectsData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée des prospects pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );

  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{prospectsData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>Nom</TableCell>
            <TableCell sx={cellStyle}>Status Validation</TableCell>
            <TableCell sx={cellStyle}>Longitude</TableCell>
            <TableCell sx={cellStyle}>Latitude</TableCell>
            <TableCell sx={cellStyle}>Retenu</TableCell>
            <TableCell sx={cellStyle}>Modifier</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {prospectsData.map(prospect => {
            const statusValidation = statusValidationValues[prospect.status_validation_fk] || 'N/A';
            return (
              <TableRow key={prospect.id}>
                <TableCell>{prospect.nom || 'N/A'}</TableCell>
                <TableCell>{statusValidation}</TableCell>
                <TableCell>{prospect.longitude || 'N/A'}</TableCell>
                <TableCell>{prospect.latitude || 'N/A'}</TableCell>
                <TableCell>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: getDotColor(prospect.retenu),
                    }}
                  />
                  {prospect.retenu === undefined ? 'N/A' : ''}
                </TableCell>
                <TableCell title="Modifier prospect" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(prospect)}
                  >
                    edit
                  </Icon>
                </TableCell>
                <TableCell title="Ajouter Prospect " placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleOpenModal(prospect)}
                  >
                    add
                  </Icon>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </table>
      {showUploadModal && selectedprospect?.Proid && (
        <ProspectStorageModal
          prospectId={selectedprospect?.Proid}
          fetchFiles={() => fetchProspectFiles(selectedprospect?.Proid)}
          onSave={() => {
            console.log('File uploaded successfully. Refreshing prospects.');
            fetchProspectsData();
          }}
          onClose={handleCloseModal}
        />
      )}
      {showModal && (
        <CombinedModal
          open={isModalOpen}
          prospect={selectedprospect}
          Proid={selectedprospect.Proid}
          dp={selectedDp}
          onSaveProspect={handleUpdate}
          onSaveDp={handleSaveDp}
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
ProspectList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default ProspectList;
