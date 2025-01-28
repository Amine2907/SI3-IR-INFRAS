import React, { useEffect } from 'react';
import MDBox from 'components/MDBox';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import ProfileModal from 'examples/popup/SettingsPopUp/ProfilePopUp';
import { Grid, TextField, Typography } from '@mui/material';
import MDButton from 'components/MDButton';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import MDAlert from 'components/MDAlert';
import { Alert, AlertDescription } from 'components/ui/alert';
import PropTypes from 'prop-types';
import SettingsFunctions from './settingsFuncs';

function Settings({ setUserData }) {
  const {
    showModal,
    userData,
    loading,
    error,
    alert,
    currentPassword,
    newPassword,
    showPassword,
    confirmNewPassword,
    fetchUserData,
    handleSavePassword,
    handleSave,
    handleCloseAlert,
    handleEditClick,
    handleModalClose,
    togglePasswordVisibility,
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,
  } = SettingsFunctions(setUserData);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        handleCloseAlert(); // Close the alert after 10 seconds
      }, 10000); // 10 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when alert changes
    }
  }, [alert]);
  // Define icons for each profile parameter
  const profileIcons = {
    'Compte créé le ': 'calendar_today',
    Email: 'email',
    Prénom: 'person',
    Nom: 'person',
    Role: 'security',
    Entreprise: 'business',
    Department: 'apartment',
    Status: 'toggle_on',
    'Date de naissance': 'cake',
    Genre: 'wc',
  };

  if (loading)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Chargement</AlertDescription>
      </Alert>
    );

  if (error)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Error: {String(error)}</AlertDescription>
      </Alert>
    );

  if (!userData)
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>Aucune donnée utilisateur disponible</AlertDescription>
      </Alert>
    );
  return (
    <div>
      <MDBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ProfileInfoCard
              userData={userData}
              title="Profile Information"
              info={{
                'Compte créé le ': userData.created_at
                  ? new Date(userData.created_at).toLocaleDateString()
                  : 'Non disponible',
                Email: userData.email || 'Non disponible',
                Prénom: userData.firstName || 'Non disponible',
                Nom: userData.lastName || 'Non disponible',
                Role: userData.user_access || 'Non disponible',
                Entreprise: userData.entreprise || 'Non disponible',
                Department: userData.department || 'Non disponible',
                Status: userData.is_active ? 'Active' : 'Inactive',
                'Date de naissance': userData.date_de_naissance
                  ? new Date(userData.date_de_naissance).toLocaleDateString()
                  : 'Non disponible',
                Genre: userData.genre || 'Non disponible',
              }}
              action={{
                onClick: handleEditClick,
                tooltip: 'Modifier Profil',
              }}
              shadow={false}
              icons={profileIcons} // Pass the icon map
            />
            {showModal && (
              <ProfileModal userData={userData} onSave={handleSave} onClose={handleModalClose} />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <MDBox mb={2}>
              <Typography variant="h6" gutterBottom>
                Changer mot de passe
              </Typography>
              <TextField
                label="Mot de passe actuel"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Nouveau mot de passe"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirmer mot de passe"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <MDButton onClick={handleSavePassword} variant="gradient" color="dark">
                ENREGISTRER
              </MDButton>
              <MDButton type="button" onClick={togglePasswordVisibility}>
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

Settings.propTypes = {
  setUserData: PropTypes.func.isRequired,
};
export default Settings;
