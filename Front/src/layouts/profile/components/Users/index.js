// components/Users.js
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Switch,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Paper,
  Box,
} from '@mui/material';
import MDBox from 'components/MDBox';
import EditIcon from '@mui/icons-material/Edit';
function Users() {
  const users = [
    {
      id: 1,
      photo: '',
      firstName: 'Mohamed Amine',
      lastName: 'ELBAH',
      email: 'elbah.ma02@gmail.com',
      entreprise: 'IR-INFRAS',
      department: '',
      role: 'Employee',
      isActive: true,
    },
  ];
  return (
    <MDBox p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">1 Résultat(s)</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '' }}>
              <TableCell sx={{ color: 'white' }}>Photo</TableCell>
              <TableCell sx={{ color: 'white' }}>Prenom</TableCell>
              <TableCell sx={{ color: 'white' }}>Nom</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Entreprise</TableCell>
              <TableCell sx={{ color: 'white' }}>Département</TableCell>
              <TableCell sx={{ color: 'white' }}>Rôle</TableCell>
              <TableCell sx={{ color: 'white' }}>Activé</TableCell>
              <TableCell sx={{ color: 'white' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar src={user.photo || '/default-avatar.png'} alt={user.firstName} />
                </TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.entreprise}</TableCell>
                <TableCell>
                  <Select
                    value={user.department}
                    displayEmpty
                    variant="outlined"
                    sx={{ width: '120px' }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="IR-INFRAS">IR-INFRAS</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="IT">IT</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Typography variant="button">{user.role}</Typography>
                </TableCell>
                <TableCell>
                  <Switch checked={user.isActive} />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MDBox>
  );
}
export default Users;
