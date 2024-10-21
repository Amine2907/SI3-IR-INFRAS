import React, { useEffect, useState } from 'react';
import entityService from 'services/entityService';
// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Grid, Switch } from '@mui/material';
import MDAlert from 'components/MDAlert';
import EntiteCard from 'examples/Cards/EntiteCard/EntiteCard';
import EntiteModal from 'examples/popup/EntitePopUp/EntitePopUp';

const EntiteList = () => {
  const [entites, setentites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchActiveentites();
  }, []);

  const fetchentites = async () => {
    const result = await entityService.getAllEntities();
    if (result.success) {
      setentites(result.data);
    } else {
      console.error(result.error);
    }
  };
  const handleAddContact = () => {
    setSelectedEntity(null); // Clear selected contact for new entry
    setShowModal(true); // Show modal for adding a new contact
  };
  const handleModalClose = () => {
    setShowModal(false); // Hide modal
    fetchentites(); // Refresh contact list after adding/editing
  };
  const handleSave = async data => {
    let result;
    let successMessage = '';
    if (selectedEntity) {
      // Update contact
      console.log('Updating entity:', selectedEntity.id);
      result = await entityService.updateEntity(selectedEntity.Eid, data);
      successMessage = 'entite updated successfully!';
    } else {
      // Create new contact
      result = await entityService.createEntity(data);
      successMessage = 'entite saved successfully!';
    }
    // Handle the result with alert feedback
    if (result.success) {
      setAlert({ show: true, message: successMessage, type: 'success' });
    } else {
      setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
    }
    handleModalClose();
  };
  // Function to close the alert
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  ///////////////////////////////////////////////////////////////////////// TOGGLE ACTIVE / Inactive
  const fetchActiveentites = async () => {
    const result = await entityService.getActiveEntites();
    if (result.success) {
      setentites(result.data); // Update your entites state here
    } else {
      console.error(result.error);
    }
  };
  const fetchInactiveentites = async () => {
    const result = await entityService.getInactiveEntites();
    if (result.success) {
      setentites(result.data); // Update your entites state here
    } else {
      console.error(result.error);
    }
  };
  // GetActive and Inactive entites
  const handleToggleActiveInactive = async () => {
    setIsActive(prevIsActive => {
      const newIsActive = !prevIsActive; // Toggle the active state
      // Fetch entites based on the new state
      if (newIsActive) {
        fetchActiveentites();
      } else {
        fetchInactiveentites();
      }
      return newIsActive; // Update the state
    });
  };
  ////////////////////////////////////////////////////////////////////////
  return (
    <div className="contact-list">
      <Card id="delete-account">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Entites
          </MDTypography>
          <MDButton onClick={handleAddContact} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
            &nbsp;Ajouter Entite
          </MDButton>
        </MDBox>
        <MDBox p={2}>
          <MDTypography variant="h6" fontWeight="medium">
            {isActive ? 'Active' : 'Inactive'}
          </MDTypography>
          <Switch
            type="checkbox"
            checked={isActive}
            onChange={handleToggleActiveInactive}
            style={{ marginRight: '10px' }}
          >
            {' '}
            {isActive ? 'Active' : 'Inactive'}
          </Switch>
          <Grid container spacing={3}>
            {entites.map(entite => (
              <Grid item xs={12} sm={8} md={4} key={entite.id}>
                <EntiteCard
                  entite={entite}
                  onEdit={() => {
                    setSelectedEntity(entite); // Set selected contact
                    setShowModal(true); // Show modal for editing
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </Card>
      {showModal && (
        <EntiteModal entite={selectedEntity} onSave={handleSave} onClose={handleModalClose} />
      )}
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
};
export default EntiteList;
