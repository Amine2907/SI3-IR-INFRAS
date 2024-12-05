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
import cellStyle from '../Styles/styles';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useProspectsData from './prospectService';
function DeclPreaList({ site }) {
  const { prospectsData, loading, error, fetchProspectsData } = useProspectsData(site);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const [selecteddp, setSelecteddp] = useState(null);
  const [selectedDp, setSelectedDp] = useState(null);
  const Sid = EB;
  const Proid = selecteddp?.Proid;
  const handleEdit = dp => {
    setSelecteddp(dp);
    setShowModal(true);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  // update a site's dp
  //   const handleUpdate = async updates => {
  //     const Proid = selecteddp?.Proid;
  //     console.log('Sending request with Proid:', Proid);
  //     console.log('Form Data:', updates);
  //     if (!Proid) {
  //       console.error('Proid is missing, cannot update.');
  //       setAlert({
  //         show: true,
  //         message: 'An error occurred: Proid is missing.',
  //         type: 'error',
  //       });
  //       return;
  //     }
  //     try {
  //       const result = await SitedpService.updatedp(Proid, updates);
  //       console.log('API result:', result);
  //       if (result.success) {
  //         setAlert({
  //           show: true,
  //           message: 'dp enregistré avec succès !',
  //           type: 'success',
  //         });
  //         fetchdpsData();
  //       } else {
  //         setAlert({
  //           show: true,
  //           message: `Error: ${result.error}`,
  //           type: 'error',
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error while sending request:', error);
  //       setAlert({
  //         show: true,
  //         message: 'An error occurred while saving the dp.',
  //         type: 'error',
  //       });
  //     }
  //     handleCloseModal(); // Close the modal after save
  //   };
  //   // handle add a DP to a dp
  //   const handleSaveDp = async data => {
  //     const { dpData } = data;
  //     // const Proid = selecteddp?.Proid;
  //     console.log('Sending request with Proid:', Proid);
  //     console.log('Form Data:', data); // Log all form data
  //     try {
  //       // Create new DP
  //       const result = await dpDpService.createDp({ Proid, dpData });
  //       console.log('API result:', result);
  //       let successMessage = '';
  //       if (result.success) {
  //         successMessage = 'Declaration Prealable enregistré avec succès !';
  //         setAlert({ show: true, message: successMessage, type: 'success' });
  //       } else {
  //         const errorMessage = `Error: ${result.error}`;
  //         console.error(errorMessage); // Log any errors from the API response
  //         setAlert({ show: true, message: errorMessage, type: 'error' });
  //       }
  //     } catch (error) {
  //       console.error('Error while sending request:', error);
  //       setAlert({
  //         show: true,
  //         message: 'An error occurred while saving the dp.',
  //         type: 'error',
  //       });
  //     }
  //     handleCloseModal();
  //   };
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
        <AlertDescription>Aucune donnée des dps pour ce site sont disponibles.</AlertDescription>
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
            <TableCell sx={cellStyle}>Nom</TableCell>
            <TableCell sx={cellStyle}>Status Validation</TableCell>
            <TableCell sx={cellStyle}>Longitude</TableCell>
            <TableCell sx={cellStyle}>Latitude</TableCell>
            <TableCell sx={cellStyle}>Retenu</TableCell>
            <TableCell sx={cellStyle}>Modifier</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {dpsData.map(dp => {
            // const statusValidation = statusValidationValues[dp.status_validation_fk] || 'N/A';
            return (
              <TableRow key={dp.id}>
                <TableCell>{dp.ANO_certificat_tacite || 'N/A'}</TableCell>
                <TableCell>{dp.arrete_opposition || 'N/A'}</TableCell>
                <TableCell>{dp.derniere_verification || 'N/A'}</TableCell>
                <TableCell>{dp.numero_DP || 'N/A'}</TableCell>
                <TableCell>{dp.relance ? 'Relance' : 'Non Relance'}</TableCell>
                <TableCell title="Modifier dp" placement="top">
                  <Icon sx={{ cursor: 'pointer' }} fontSize="small" onClick={() => handleEdit(dp)}>
                    edit
                  </Icon>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </table>
    </TableContainer>
  );
}
DeclPreaList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default DeclPreaList;
