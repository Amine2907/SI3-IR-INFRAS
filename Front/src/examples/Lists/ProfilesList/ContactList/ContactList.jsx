import React, { useEffect, useState } from 'react';
import ContactCard from '../../../Cards/ConatctCards/ContactCard';
import ContactModal from '../../../popup/ContactPopUp/ContactPopUpl';
import './ContactList.module.css';
import contactService from 'services/contactsService';
// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Images
import masterCardLogo from 'assets/images/logos/mastercard.png';

// Material Dashboard 2 React context
import { useMaterialUIController } from '../../../../context/index';
const ContactList = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
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

  const handleEditContact = contact => {
    setSelectedContact(contact); // Set the selected contact for editing
    setShowModal(true); // Show modal for editing
  };

  const handleModalClose = () => {
    setShowModal(false); // Hide modal
    fetchContacts(); // Refresh contact list after adding/editing
  };

  const handleSave = async data => {
    if (selectedContact) {
      // Update contact
      await contactService.updateContact(selectedContact.id, data);
    } else {
      // Create new contact
      await contactService.createContact(data);
    }
    handleModalClose(); // Close modal after operation
  };

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
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MDBox
                borderRadius="lg"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
                sx={{
                  border: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                }}
              >
                <MDBox component="img" src={masterCardLogo} alt="master card" width="10%" mr={2} />
                <MDTypography variant="h6" fontWeight="medium">
                  ELBAH
                </MDTypography>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Tooltip title="Edit Card" placement="top">
                    <Icon sx={{ cursor: 'pointer' }} fontSize="small">
                      edit
                    </Icon>
                  </Tooltip>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      <div className="contact-cards">
        {contacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} onEdit={handleEditContact} />
        ))}
      </div>
      {showModal && (
        <ContactModal contact={selectedContact} onSave={handleSave} onClose={handleModalClose} />
      )}
    </div>
  );
};
export default ContactList;
