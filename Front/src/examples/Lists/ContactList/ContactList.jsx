/**
 * This component renders the contact list page.
 *
 * It renders a card with a form to search contacts by name, first name, and mission.
 * It renders a button to add a new contact.
 * It renders a list of contacts, with a card for each contact.
 * It renders a toggle to activate or desactivate the contact.
 * It renders a modal to add or edit a contact.
 * It also renders a feedback alert for actions.
 */
import React, { useEffect, useState } from 'react';
import ContactCard from 'examples/Cards/ConatctCards/ContactCard';
// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Grid, Switch } from '@mui/material';
import MDAlert from 'components/MDAlert';
import ContactModal from 'examples/popup/ContactPopUp/ContactPopUpl';
import { Alert, AlertDescription } from 'components/ui/alert';
import {
  fetchActiveContacts,
  fetchInactiveContacts,
  handleSave,
  handleSearchContacts,
  handleSearchChange,
} from './contactsFuncs';
const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isActive, setIsActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    nom: '',
    prenom: '',
    mission: '',
  });
  const [noResultsMessage, setNoResultsMessage] = useState('');

  useEffect(() => {
    fetchActiveContacts(setContacts, setNoResultsMessage);
  }, []);

  const handleAddContact = () => {
    setSelectedContact(null); // Clear selected contact for new entry
    setShowModal(true); // Show modal for adding a new contact
    fetchActiveContacts(setContacts, setNoResultsMessage);
  };

  const handleModalClose = () => {
    setShowModal(false);
    fetchActiveContacts(setContacts, setNoResultsMessage); // Refresh contact list
  };

  // Handle saving contacts
  const saveContact = async data => {
    const result = await handleSave(
      data,
      selectedContact,
      setAlert,
      isActive,
      setContacts,
      setNoResultsMessage,
      handleModalClose
    );
    if (result) {
      handleModalClose();
      fetchActiveContacts(setContacts, setNoResultsMessage);
      setIsActive(true);
    }
  };
  // Handle search change
  const handleChange = e => {
    handleSearchChange(
      e,
      searchQuery,
      setSearchQuery,
      setContacts,
      setNoResultsMessage,
      handleSearchContacts
    );
  };
  const handleToggleActiveInactive = () => {
    setIsActive(prevIsActive => {
      const newIsActive = !prevIsActive; // Toggle the active state
      if (newIsActive) {
        fetchActiveContacts(setContacts, setNoResultsMessage);
      } else {
        fetchInactiveContacts(setContacts, setNoResultsMessage);
      }
      return newIsActive; // Update the state
    });
  };
  return (
    <div className="contact-list">
      <Card id="delete-account">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox pr={1}>
            <div className="contact-list">
              <MDInput
                label="Search by nom"
                name="nom"
                value={searchQuery.nom}
                onChange={handleChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Search by prenom"
                name="prenom"
                value={searchQuery.prenom}
                onChange={handleChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Search by mission "
                name="mission"
                value={searchQuery.mission}
                onChange={handleChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />

              <MDButton
                onClick={() => {
                  setNoResultsMessage('');
                  setSearchQuery({ nom: '', prenom: '', mission: '' });
                  fetchActiveContacts(setContacts, setNoResultsMessage); // Reset to active entities
                }}
                variant="gradient"
                color="dark"
              >
                Clear Search
              </MDButton>
            </div>
          </MDBox>
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
          />
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
          {noResultsMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{noResultsMessage}</AlertDescription>
            </Alert>
          )}
        </MDBox>
      </Card>
      {showModal && (
        <ContactModal contact={selectedContact} onSave={saveContact} onClose={handleModalClose} />
      )}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={() => setAlert({ show: false, message: '', type: '' })}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}
    </div>
  );
};
export default ContactList;
