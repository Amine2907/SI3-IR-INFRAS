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
import useDpsForProspects from './declpreaService';
import ProspectDpService from 'services/site_details/DP/DpService';
import DpUModal from 'examples/popup/DeclPreaPopUp/DpPopUp';
function DeclPreaList() {
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const [selecteddp, setSelecteddp] = useState(null);
  const siteId = EB;
  const { dpsData, loading, error, fetchDpData } = useDpsForProspects(siteId);
  const handleEdit = dp => {
    console.log('Editing DP:', dp);
    setSelecteddp(dp);
    setShowModal(true);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleUpdate = async updates => {
    const DPid = selecteddp?.DPid;
    console.log('Sending update for DPid:', DPid, 'Updates:', updates);
    if (!DPid) {
      console.error('DPid is missing, cannot update.');
      setAlert({
        show: true,
        message: 'An error occurred: DPid is missing.',
        type: 'error',
      });
      return;
    }
    const { prospectName, ...filteredUpdates } = updates;
    try {
      const result = await ProspectDpService.updateDp(DPid, filteredUpdates);
      console.log('API result:', result);
      if (result.success) {
        setAlert({
          show: true,
          message: 'DP enregistré avec succès !',
          type: 'success',
        });
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
        message: 'An error occurred while updating the DP.',
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
              </TableRow>
            );
          })}
        </TableBody>
      </table>
      {showModal && <DpUModal dp={selecteddp} onSave={handleUpdate} onClose={handleCloseModal} />}
    </TableContainer>
  );
  5;
}
DeclPreaList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default DeclPreaList;
