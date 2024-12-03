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
import useProspectsData from './prospectService';
import cellStyle from './styles';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProspectModal from 'examples/popup/ProspectsPopUp/ProspectPopUp';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import CombinedModal from 'examples/popup/PropsectDpPopUp/CombinedPopUp';
function ProspectList({ site }) {
  const { prospectsData, loading, error, fetchProspectsData } = useProspectsData(site);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const [selectedprospect, setSelectedprospect] = useState(null);
  const [selectedDp, setSelectedDp] = useState(null);
  const Sid = EB;
  const handleEdit = prospect => {
    setSelectedprospect(prospect);
    setShowModal(true);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (Sid) {
      fetchProspectsData();
    }
  }, [site, fetchProspectsData]);
  const handleUpdate = async updates => {
    const Proid = selectedprospect?.Proid;
    console.log('Sending request with Proid:', Proid);
    console.log('Form Data:', updates);
    if (!Proid) {
      console.error('Proid is missing, cannot update.');
      setAlert({
        show: true,
        message: 'An error occurred: Proid is missing.',
        type: 'error',
      });
      return;
    }
    try {
      const result = await SiteProspectService.updateProspect({ Proid, updates });
      console.log('API result:', result);
      if (result.success) {
        setAlert({
          show: true,
          message: 'Prospect enregistré avec succès !',
          type: 'success',
        });
        fetchProspectsData(); // Refresh the prospects list
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
        message: 'An error occurred while saving the prospect.',
        type: 'error',
      });
    }
    handleCloseModal(); // Close the modal after save
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
            // const statusValidation = statusValidationValues[prospect.status_validation_fk] || 'N/A';
            return (
              <TableRow key={prospect.id}>
                <TableCell>{prospect.nom || 'N/A'}</TableCell>
                <TableCell>{prospect.status_validation_fk || 'N/A'}</TableCell>
                <TableCell>{prospect.longitude || 'N/A'}</TableCell>
                <TableCell>{prospect.latitude || 'N/A'}</TableCell>
                <TableCell>{prospect.retenu || 'N/A'}</TableCell>
                <TableCell title="Modifier prospect" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(prospect)} // Pass the current prospect
                  >
                    edit
                  </Icon>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </table>
      {showModal && (
        <CombinedModal
          open={isModalOpen}
          prospect={selectedprospect}
          dp={selectedDp}
          onSaveProspect={handleUpdate}
          onSaveDp={handleUpdate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </TableContainer>
  );
}
ProspectList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default ProspectList;
