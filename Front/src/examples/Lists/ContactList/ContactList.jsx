/**
 * This component renders a list of contacts.
 *
 * It fetches the list of contacts from the backend when it mounts.
 * It renders a card for each contact, with a button to edit the contact.
 * It also renders a button to add a new contact, and a modal to edit or add a contact.
 *
 * The modal is used to edit or add a contact. It contains a form with the contact's name, email, and phone.
 * When the form is submitted, it sends the data to the backend and then fetches the new list of contacts.
 *
 * If there is an error, it renders an alert with the error message.
 */
import React, { useEffect, useState } from 'react';
import contactService from 'services/contactsService';
import ContactCard from 'examples/Cards/ConatctCards/ContactCard';
// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDInput from 'components/MDInput';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Grid, Switch } from '@mui/material';
import MDAlert from 'components/MDAlert';
import ContactModal from 'examples/popup/ContactPopUp/ContactPopUpl';
import { Alert, AlertDescription } from 'components/ui/alert';
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
    fetchActiveContacts();
  }, []);

  // const fetchContacts = async () => {
  //   const result = await contactService.getAllContacts();
  //   if (result.success) {
  //     setContacts(result.data);
  //   } else {
  //     console.error(result.error);
  //   }
  // };
  const handleAddContact = () => {
    setSelectedContact(null); // Clear selected contact for new entry
    setShowModal(true); // Show modal for adding a new contact
  };
  const handleModalClose = () => {
    setShowModal(false); // Hide modal
    fetchActiveContacts(); // Refresh contact list after adding/editing
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
    if (isActive) {
      fetchActiveContacts(); // If isActive is true, fetch active entities
    } else {
      fetchInactiveContacts(); // If isActive is false, fetch inactive entities
    }
    setIsActive(true); // Set the switch state to Active after modifying an entity
  };
  // Function to close the alert
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  ///////////////////////////////////////////////////////////////////////// SEARCH
  const handleSearchChange = e => {
    const { name, value } = e.target;
    setSearchQuery(prev => ({ ...prev, [name]: value }));

    if (value === '') {
      fetchActiveContacts(); // If search input is cleared, fetch active entities
    } else {
      handleSearchContacts(); // If there's input, fetch filtered entities
    }
  };
  const handleSearchContacts = async () => {
    const result = await contactService.searchContacts(searchQuery);
    if (result.success) {
      setContacts(result.data);
      // Show message if no contacts are found
      if (result.data.length === 0) {
        setNoResultsMessage('No contacts found for the specified search criteria.');
      } else {
        setNoResultsMessage(''); // Clear message if results are found
      }
    } else {
      console.error(result.error);
    }
  };
  ///////////////////////////////////////////////////////////////////////// TOGGLE ACTIVE / Inactive
  const fetchActiveContacts = async () => {
    setNoResultsMessage('');
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
          <MDBox pr={1}>
            <div className="contact-list">
              <MDInput
                label="Search by nom"
                name="nom"
                value={searchQuery.nom}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Search by prenom"
                name="prenom"
                value={searchQuery.prenom}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Search by mission "
                name="mission"
                value={searchQuery.mission}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />

              <MDButton
                onClick={() => {
                  setNoResultsMessage('');
                  setSearchQuery({ nom: '', prenom: '', mission: '' });
                  fetchActiveContacts(); // Reset to active entities
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
          {/* Conditionally render the no results alert */}
          {noResultsMessage && (
            <Alert variant="success" className="mt-4">
              <AlertDescription>{noResultsMessage}</AlertDescription>
            </Alert>
          )}
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
