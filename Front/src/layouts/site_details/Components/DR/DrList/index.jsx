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
import cellStyle from './Styles/styles';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SiteDemracService from 'services/site_details/DR/DrService';
import CombinedModal from 'examples/popup/PropsectDpPopUp/CombinedPopUp';
import usedemracData from './DrService';
import statusPropValues from './DrData';
function DemRacList({ site }) {
  const { demracData, loading, error, fetchDemracData } = usedemracData(site);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const location = useLocation();
  const { EB } = location.state || {};
  const [selecteddemrac, setSelecteddemrac] = useState(null);
  const [selectedDp, setSelectedDp] = useState(null);
  const Sid = EB;
  const NDRid = selecteddemrac?.NDRid;
  const handleEdit = demrac => {
    setSelecteddemrac(demrac);
    setShowModal(true);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (demracData && demracData.length > 0) {
      console.log('demracs Data:', demracData);
      demracData.forEach(demrac => {
        console.log('Status proposition FK:', demrac.SPRid_FK);
      });
    }
  }, [demracData]);
  useEffect(() => {
    if (Sid) {
      fetchDemracData();
    }
  }, [site, fetchDemracData]);
  // update a site's demrac
  const handleUpdate = async updates => {
    const NDRid = selecteddemrac?.NDRid;
    console.log('Sending request with NDRid:', NDRid);
    console.log('Form Data:', updates);
    if (!NDRid) {
      console.error('Le NDRid est manquant, impossible de mettre à jour.');
      setAlert({
        show: true,
        message: "Une erreur s'est produite : l'ID du demrac est manquant.",
        type: 'error',
      });
      return;
    }
    try {
      const result = await SiteDemracService.updateDemRac(NDRid, updates);
      console.log('API result:', result);
      if (result.success) {
        setAlert({
          show: true,
          message: 'demrac modifié avec succès !',
          type: 'success',
        });
        fetchDemracData();
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
        message: "Une erreur s'est produite lors de l'enregistrement du demrac.",
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

  if (!demracData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>
          Aucune donnée des demracs pour ce site sont disponibles.
        </AlertDescription>
      </Alert>
    );

  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{demracData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>N Demande</TableCell>
            <TableCell sx={cellStyle}>Nom Prospect</TableCell>
            <TableCell sx={cellStyle}>DR DATE</TableCell>
            <TableCell sx={cellStyle}>KO DATE </TableCell>
            <TableCell sx={cellStyle}>Type de raccordement</TableCell>
            <TableCell sx={cellStyle}>Status proposition</TableCell>
            <TableCell sx={cellStyle}>Opearateurs</TableCell>
            <TableCell sx={cellStyle}>Modifier</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {demracData.map(demrac => {
            const statusProp = statusPropValues[demrac.SPRid_FK] || 'N/A';
            return (
              <TableRow key={demrac.id}>
                <TableCell>{demrac.NDRid || 'N/A'}</TableCell>
                <TableCell>{demrac.date_dr || 'N/A'}</TableCell>
                <TableCell>{demrac.KO_DP || 'N/A'}</TableCell>
                <TableCell>{demrac.type_rac || 'N/A'}</TableCell>
                <TableCell>{statusProp}</TableCell>
                <TableCell>{demrac.operator || 'N/A'}</TableCell>
                <TableCell title="Modifier demrac" placement="top">
                  <Icon
                    sx={{ cursor: 'pointer' }}
                    fontSize="small"
                    onClick={() => handleEdit(demrac)}
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
          demrac={selecteddemrac}
          NDRid={selecteddemrac.NDRid}
          dp={selectedDp}
          onSavedemrac={handleUpdate}
          onSaveDp={handleSaveDp}
          onClose={() => setIsModalOpen(false)}
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
DemRacList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default DemRacList;
