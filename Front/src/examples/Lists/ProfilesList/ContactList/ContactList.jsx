import React, { useEffect, useState } from 'react';
import ContactModal from '../../../popup/ContactPopUp/ContactPopUpl';
import contactService from 'services/contactsService';
import ContactCard from 'examples/Cards/ConatctCards/ContactCard';
// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Grid, Switch } from '@mui/material';
import MDAlert from 'components/MDAlert';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchActiveContacts();
  }, []);

  const fetchContacts = async () => {
    const result = await contactService.getAllContacts();
    if (result.success) {
      setContacts(result.data);
    } else {
      console.error(result.error);
    }
  };
  const handleAddContact = () => {
    setSelectedContact(null); // Clear selected contact for new entry
    setShowModal(true); // Show modal for adding a new contact
  };
  const handleModalClose = () => {
    setShowModal(false); // Hide modal
    fetchContacts(); // Refresh contact list after adding/editing
  };
  const handleSave = async data => {
    let result;
    let successMessage = '';
    if (selectedContact) {
      // Update contact
      console.log('Updating Contact:', selectedContact.id);
      result = await contactService.updateContact(selectedContact.Cid, data);
      successMessage = 'Contact updated successfully!';
    } else {
      // Create new contact
      result = await contactService.createContact(data);
      successMessage = 'Contact saved successfully!';
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
  const fetchActiveContacts = async () => {
    const result = await contactService.getActiveContacts();
    if (result.success) {
      setContacts(result.data); // Update your contacts state here
    } else {
      console.error(result.error);
    }
  };
  const fetchInactiveContacts = async () => {
    const result = await contactService.getInactiveContacts();
    if (result.success) {
      setContacts(result.data); // Update your contacts state here
    } else {
      console.error(result.error);
    }
  };
  // GetActive and Inactive contacts
  const handleToggleActiveInactive = async () => {
    setIsActive(prevIsActive => {
      const newIsActive = !prevIsActive; // Toggle the active state
      // Fetch contacts based on the new state
      if (newIsActive) {
        fetchActiveContacts();
      } else {
        fetchInactiveContacts();
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
            Contacts
          </MDTypography>
          <MDButton onClick={handleAddContact} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
            &nbsp;Ajouter Contact
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
            {contacts.map(contact => (
              <Grid item xs={12} sm={8} md={4} key={contact.id}>
                <ContactCard
                  contact={contact}
                  onEdit={() => {
                    setSelectedContact(contact); // Set selected contact
                    setShowModal(true); // Show modal for editing
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </Card>
      {showModal && (
        <ContactModal contact={selectedContact} onSave={handleSave} onClose={handleModalClose} />
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
export default ContactList;
