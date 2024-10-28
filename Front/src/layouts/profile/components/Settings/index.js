import React, { useState, useEffect, useCallback } from 'react';
import MDBox from 'components/MDBox';
import { useAuth } from 'context/Auth/AuthContext';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import ProfileModal from 'examples/popup/SettingsPopUp/ProfilePopUp';
import settingsService from 'services/settingsService';
import { Alert, AlertDescription } from 'components/ui/alert';
import MDAlert from 'components/MDAlert';
import { Grid, TextField, Typography } from '@mui/material';
import MDButton from 'components/MDButton';
function Settings() {
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const fetchUserData = useCallback(async () => {
    if (user?.id) {
      try {
        setLoading(true);
        console.log('Fetching user data for ID:', user.id);
        const response = await settingsService.getAccountInfo(user.id); // Ensure this returns the correct structure
        console.log('API response:', response); // Log full response for inspection

        if (response.success && response.data) {
          setUserData(response.data);
        } else {
          // Ensure we are setting an error message as a string
          const apiError = response.error?.message || 'Failed to fetch user data';
          console.error('API Error:', apiError); // Log the error
          setError(apiError); // Set the error in state
        }
      } catch (err) {
        console.error('Error fetching user data:', err); // Log the error
        setError('An error occurred while fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('User information is not available');
    }
  }, [user]);
  /////////////////////////////////////////////////////
  const handleSavePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setAlert({ show: true, message: 'New passwords do not match.', type: 'error' });
      return;
    }
    // LOGIC HERE
    setAlert({ show: true, message: 'Password changed successfully.', type: 'success' });
  };
  /////////////////////////////////////////////////////
  const handleSave = async data => {
    let result;
    let successMessage = '';
    try {
      if (selectedUser) {
        // Update user
        result = await settingsService.updateUser(selectedUser.id, data);
        successMessage = 'User updated successfully!';
      }
      // Check if result is defined and has the success property
      if (result && result.success) {
        setAlert({ show: true, message: successMessage, type: 'success' });
      } else {
        // Handle case where result is undefined or does not have success
        const errorMessage = result?.error || 'Unknown error occurred while updating user.';
        setAlert({ show: true, message: `Error: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      // Catch any errors from the updateUser call
      console.error('Error updating user:', error); // Log the error
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    } finally {
      handleModalClose(); // Ensure modal closes regardless of outcome
    }
  };
  ////////////////////////////////////////////////////////
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  ////////////////////////////////////////
  useEffect(() => {
    console.log('Auth loading:', authLoading);
    console.log('User from AuthContext:', user);

    if (!authLoading) {
      fetchUserData();
    }
  }, [authLoading, fetchUserData]);

  const handleEditClick = () => setShowModal(true) && setSelectedUser(userData);
  const handleModalClose = () => setShowModal(false);
  // Handle loading state
  if (authLoading || loading)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Loading</AlertDescription>
      </Alert>
    );
  // Handle error state
  if (error)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Error: {String(error)}</AlertDescription>
      </Alert>
    );
  // Handle the case where userData is not available
  if (!userData)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>No user data available</AlertDescription>
      </Alert>
    );
  console.log('Rendering user data:', userData);
  return (
    <div>
      <MDBox mt={5} mb={3}>
        <Grid container spacing={3}>
          {/* Profile Information Section */}
          <Grid item xs={12} md={6}>
            <ProfileInfoCard
              userData={userData}
              title="Profile Information"
              info={{
                'Account Created': userData.created_at
                  ? new Date(userData.created_at).toLocaleDateString()
                  : 'Not available',
                Email: userData.email || 'Not available',
                'First Name': userData.firstname || 'Not available',
                'Last Name': userData.lastname || 'Not available',
                Role: userData.user_access || 'Not available',
                Company: userData.entreprise || 'Not available',
                Department: userData.department || 'Not available',
                Status: userData.is_active ? 'Active' : 'Inactive',
                'Date of Birth': userData.date_de_naissance
                  ? new Date(userData.date_de_naissance).toLocaleDateString()
                  : 'Not available',
                Gender: userData.genre || 'Not available',
              }}
              action={{
                onClick: handleEditClick,
                tooltip: 'Edit Profile',
              }}
              shadow={false}
            />
            {showModal && (
              <ProfileModal
                userData={selectedUser}
                onSave={handleSave}
                onClose={handleModalClose}
              />
            )}
          </Grid>
          {/* Change Password Section */}
          <Grid item xs={12} md={6}>
            <MDBox mb={2}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <TextField
                label="Current Password"
                variant="outlined"
                fullWidth
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <MDButton
                onClick={handleSavePassword}
                variant="gradient"
                color="dark"
                style={{ marginLeft: '10px', marginTop: '10px' }}
              >
                Save
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      {/* Alert Notification */}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={handleCloseAlert}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}
    </div>
  );
}
export default Settings;
