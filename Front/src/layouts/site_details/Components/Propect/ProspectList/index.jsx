import React, { useEffect } from 'react';
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
// import statusValidationValues from './ProspectData';
function ProspectList({ site }) {
  const { prospectsData, loading, error, fetchProspectsData } = useProspectsData(site);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const handleEdit = () => {
    null;
  };

  useEffect(() => {
    if (Sid) {
      fetchProspectsData();
    }
  }, [site, fetchProspectsData]);

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
                  <Icon sx={{ cursor: 'pointer' }} fontSize="small" onClick={handleEdit}>
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
ProspectList.propTypes = {
  site: PropTypes.string.isRequired,
};
export default ProspectList;
