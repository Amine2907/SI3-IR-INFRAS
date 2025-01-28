/**
 * Displays a list of users.
 *
 * @returns {JSX.Element} The users list
 */
import React, { useEffect } from 'react';
import {
  TableContainer,
  TableCell,
  TableRow,
  Box,
  Typography,
  Avatar,
  TableBody,
} from '@mui/material';
import { useAuth } from 'context/Auth/AuthContext';
import { Alert, AlertDescription } from 'components/ui/alert';
import useUserData from './userService';
import cellStyle from './styles';
function Users() {
  const { user, loading: authLoading } = useAuth();
  const { userData, loading, error, fetchUserData } = useUserData(user);

  useEffect(() => {
    if (!authLoading) {
      fetchUserData();
    }
  }, [authLoading, fetchUserData]);

  if (authLoading || loading)
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

  if (!userData.length)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Aucune donnée utilisateur disponible</AlertDescription>
      </Alert>
    );
  return (
    <TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{userData.length} Résultat(s)</Typography>
      </Box>
      <table>
        <thead>
          <TableRow>
            <TableCell sx={cellStyle}>Photo</TableCell>
            <TableCell sx={cellStyle}>Prenom</TableCell>
            <TableCell sx={cellStyle}>Nom</TableCell>
            <TableCell sx={cellStyle}>Email</TableCell>
            <TableCell sx={cellStyle}>Entreprise</TableCell>
            <TableCell sx={cellStyle}>Département</TableCell>
            <TableCell sx={cellStyle}>Rôle</TableCell>
            <TableCell sx={cellStyle}>Activé</TableCell>
            <TableCell sx={cellStyle}>Action</TableCell>
          </TableRow>
        </thead>
        <TableBody>
          {userData.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar src={user.photo || '/placeholder.svg'} alt={user.firstName} />
              </TableCell>
              <TableCell>{user.firstName || 'N/A'}</TableCell>
              <TableCell>{user.lastName || 'N/A'}</TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{user.entreprise || 'N/A'}</TableCell>
              <TableCell>{user.department || 'N/A'}</TableCell>
              <TableCell>{user.user_access || 'N/A'}</TableCell>
              <TableCell>{user.isActive ? 'Oui' : 'Non'}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </TableContainer>
  );
}
export default Users;
