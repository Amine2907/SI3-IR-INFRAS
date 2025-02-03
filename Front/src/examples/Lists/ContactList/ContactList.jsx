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
import { fetchActiveContacts, fetchInactiveContacts, handleSave } from './contactsFuncs';
const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isActive, setIsActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResultsMessage, setNoResultsMessage] = useState('');

  useEffect(() => {
    fetchActiveContacts(setContacts, setNoResultsMessage);
  }, []);

  const handleAddContact = () => {
    setSelectedContact(null); // Clear selected contact for new entry
    setShowModal(true); // Show modal for adding a new contact
    fetchActiveContacts(setContacts, setNoResultsMessage);
  };
  const handleSearchChange = e => {
    const { value } = e.target;
    setSearchQuery(value);

    if (value.trim() === '') {
      fetchActiveContacts(setContacts, setNoResultsMessage);
    } else {
      const filteredContacts = contacts.filter(contact => {
        const lowercasedValue = value.toLowerCase();
        return (
          contact.nom.toLowerCase().includes(lowercasedValue) ||
          contact.prenom.toLowerCase().includes(lowercasedValue) ||
          contact.mission.toLowerCase().includes(lowercasedValue)
        );
      });

      setContacts(filteredContacts);

      if (filteredContacts.length === 0) {
        setNoResultsMessage('Aucune contact trouvée pour les critères de recherche spécifiés');
      } else {
        setNoResultsMessage('');
      }
    }
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
      newAlert => {
        setAlert(newAlert);
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 10000);
      },
      isActive,
      setContacts,
      setNoResultsMessage,
      handleModalClose
    );
    if (result) {
      handleModalClose();
      fetchActiveContacts(setContacts, setNoResultsMessage);
      handleToggleActiveInactive();
      setIsActive(true);
    }
  };
  const handleToggleActiveInactive = () => {
    setIsActive(prevIsActive => {
      const newIsActive = !prevIsActive; // Toggle the active state
      if (newIsActive) {
        fetchActiveContacts(setContacts, setNoResultsMessage);
      } else {
        fetchInactiveContacts(setContacts, setNoResultsMessage);
      }
      setNoResultsMessage(''); // clear the no results message if any
      return newIsActive; // Update the state
    });
  };
  const clearSearch = () => {
    setSearchQuery(''); // Clear the search query
    setNoResultsMessage(''); // Reset the no results message
    fetchActiveContacts(setContacts, setNoResultsMessage); // Fetch the full list of active contacts
  };
  return (
    <div className="contact-list">
      <Card id="search-contacts">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox pr={1}>
            <div className="contact-list">
              <MDInput
                label="Recherche par nom, prénom, mission"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <MDButton onClick={clearSearch} variant="gradient" color="dark">
                Effacer la recherche
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
