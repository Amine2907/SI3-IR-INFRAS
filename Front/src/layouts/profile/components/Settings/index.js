// components/Settings.js
import React, { useState } from 'react';
// @mui material components
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import ProfileModal from 'examples/popup/SettingsPopUp/ProfilePopUp';
function Settings() {
  // State to control the modal visibility
  const [showModal, setShowModal] = useState(false);

  // Function to handle opening the modal
  const handleEditClick = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <MDBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} xl={4}>
            <ProfileInfoCard
              title="profile information"
              description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              info={{
                'Compte cree le': '',
                fullName: 'Alec Thompson',
                Role: '',
                email: 'alecthompson@mail.com',
                Genre: '',
                'Date de naissance': '',
              }}
              action={{
                onClick: handleEditClick, // Show modal on click
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
      {showModal && <ProfileModal onClose={handleModalClose} />}
    </DashboardLayout>
  );
}
export default Settings;
