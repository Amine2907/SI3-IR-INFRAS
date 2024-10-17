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
import { Grid } from '@mui/material';

const ContactList = () => {
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
    </div>
  );
};
export default ContactList;
