import React, { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import MDBox from 'components/MDBox';
import { useAuth } from 'context/Auth/AuthContext';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import ProfileModal from 'examples/popup/SettingsPopUp/ProfilePopUp';
import settingsService from 'services/settingsService';

function Settings() {
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    console.log('Auth loading:', authLoading);
    console.log('User from AuthContext:', user);

    if (!authLoading) {
      fetchUserData();
    }
  }, [authLoading, fetchUserData]);

  const handleEditClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  // Handle loading state
  if (authLoading || loading) return <div>Loading...</div>;
  // Handle error state
  if (error) return <div style={{ color: 'red' }}>Error: {String(error)}</div>; // Use String() to ensure rendering a string
  // Handle the case where userData is not available
  if (!userData) return <div>No user data available</div>;

  console.log('Rendering user data:', userData);

  return (
    <div className="settings-list">
      <MDBox mb={2} />
      <MDBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} xl={4}>
            <ProfileInfoCard
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
          </Grid>
          <Grid item xs={12} md={6} xl={4} sx={{ display: 'flex' }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
        </Grid>
      </MDBox>
      {showModal && <ProfileModal onClose={handleModalClose} userData={userData} />}
    </div>
  );
}

export default Settings;
