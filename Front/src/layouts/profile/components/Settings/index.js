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
import { EyeIcon, EyeOffIcon } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  // FETCH USER DATA FIRST COMPONENT
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
    const passwordComplexityCheck = password => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
    };
    // Check password complexity
    if (!passwordComplexityCheck(newPassword)) {
      setAlert({
        show: true,
        message: 'Password must include uppercase, lowercase, number, and special character.',
        type: 'error',
      });
      return;
    }
    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      setAlert({ show: true, message: 'New passwords do not match.', type: 'error' });
      return;
    }
    // Check minimum password length
    if (newPassword.length < 8) {
      setAlert({
        show: true,
        message: 'Password must be at least 8 characters long.',
        type: 'error',
      });
      return;
    }
    try {
      const userId = user?.id;
      // Check if user ID is available
      if (!userId) {
        setAlert({ show: true, message: 'User ID is not available.', type: 'error' });
        return; // Prevent making an API call without a user ID
      }
      // Call the settings service to update the password
      const response = await settingsService.updatePassword(userId, currentPassword, newPassword);
      // Check the response
      if (response.success) {
        setAlert({ show: true, message: 'Password changed successfully.', type: 'success' });
        // Reset password fields after successful change
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        // Handle specific error messages returned by the API
        const errorMessage = response.error?.message || 'Failed to change password';
        setAlert({ show: true, message: `Error: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error changing password:', error); // Log error for debugging
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  /////////////////////////////////////////////////////
  // Saving User Data Modifications
  const handleSave = async data => {
    let result;
    let successMessage = '';
    console.log('Data to save:', data); // Log data being saved
    try {
      if (selectedUser) {
        // Update user
        result = await settingsService.updateUser(selectedUser.id, data);
        console.log('Update user response:', result); // Log the API response
        successMessage = 'User updated successfully!';
      }
      if (result && result.success) {
        setAlert({ show: true, message: successMessage, type: 'success' });
        // await fetch User Data to view directly the modifications
        await fetchUserData();
      } else {
        const errorMessage = result?.error || 'Unknown error occurred while updating user.';
        setAlert({ show: true, message: `Error: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    } finally {
      handleModalClose(); // Ensure modal closes regardless of outcome
    }
  };
  ////////////////////////////////////////////////////////
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (!authLoading) {
      fetchUserData();
    }
  }, [authLoading, fetchUserData]);
  //////////////////////////////////////////////////////
  const handleEditClick = () => {
    setSelectedUser(userData); // Set the user data to be edited
    setShowModal(true); // Show the modal
  };
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
              <ProfileModal userData={userData} onSave={handleSave} onClose={handleModalClose} />
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
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm New Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <MDButton
                onClick={handleSavePassword}
                variant="gradient"
                color="dark"
                style={{ marginTop: '5px' }}
              >
                Save
              </MDButton>
              <MDButton
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
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
