/**
 * The Users component is responsible for displaying the list of users.
 *
 * It fetches the list of users from the server and displays it in a table.
 * The table has the following columns: Photo, Prenom, Nom, Email, Entreprise, Département, Rôle, Activé, Action.
 * The user can sort the table by any of these columns.
 *
 * @requires {Object} user - The user object returned by the useAuth hook.
 * @requires {Boolean} loading - A boolean indicating whether the user data is being fetched.
 * @requires {Function} fetchUserData - A function that fetches the user's data.
 * @requires {Function} setError - A function that sets the error message.
 * @requires {Function} setLoading - A function that sets the loading state.
 * @requires {Array} userData - The list of users fetched from the server.
 * @requires {Object} error - The error message if any.
 * @requires {Boolean} authLoading - A boolean indicating whether the user is logged in.
 */
import React, { useCallback, useEffect, useState } from 'react';
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
import settingsService from 'services/settingsService';
import { Alert, AlertDescription } from 'components/ui/alert';
function Users() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await settingsService.getAccountInfo(user.id);

        if (response.success && response.data) {
          // Wrap response.data in an array if it's not already an array
          setUserData(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          const apiError = response.error?.message || 'Failed to fetch user data';
          setError(apiError);
        }
      } catch (err) {
        setError('An error occurred while fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('User information is not available');
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserData();
    }
  }, [authLoading, fetchUserData]);

  if (authLoading || loading)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Loading</AlertDescription>
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
        <AlertDescription>No user data available</AlertDescription>
      </Alert>
    );

  const cellStyle = {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
  };

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
                <Avatar
                  src={user.photo || '/placeholder.svg?height=40&width=40'}
                  alt={user.firstName}
                />
              </TableCell>
              <TableCell>{user.firstname || 'N/A'}</TableCell>
              <TableCell>{user.lastname || 'N/A'}</TableCell>
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
