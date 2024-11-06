// ContactList Component
// Overview
// The ContactList component is a React component responsible for displaying a list of contacts with functionalities to search, add, edit, and toggle active/inactive states. It allows users to search contacts by name, first name, and mission, and includes a modal for adding or editing contacts. It also provides feedback via alerts for different user actions.
// Features
// Search Contacts: Search contacts by name, first name, or mission.
// Add/Edit Contact: Opens a modal to add or edit contacts.
// Active/Inactive Toggle: Toggle between viewing active or inactive contacts.
// Alerts: Show feedback messages such as success or error alerts.
// Contact Cards: Displays a grid of ContactCard components with contact details.
// Props
// This component does not receive any props directly. Instead, it manages internal state such as contacts, search queries, and modal visibility.
// State Variables
// contacts: Type: Array
// Description: Stores the list of contacts to be displayed.
// showModal:
// Type: Boolean
// Description: Controls whether the modal for adding/editing contacts is visible.
// selectedContact:
// Type: Object or null
// Description: Stores the contact that is selected for editing. If null, it means a new contact is being added.
// alert:
// Type: Object
// Description: Contains information for the feedback alert, including the message and alert type (e.g., success or error).
// isActive:
// Type: Boolean
// Description: Toggles between displaying active or inactive contacts.
// searchQuery:
// Type: Object
// Description: Stores the search query for filtering contacts based on name, first name, or mission.
// noResultsMessage:
// Type: String
// Description: Stores a message to be displayed when no contacts match the search query.
// Dependencies
// React: For managing the component state and lifecycle.
// @mui/material: For Material UI components like Card, Icon, Switch, Grid, Button, Input, and others.
// MDBox, MDTypography, MDButton, MDInput, MDAlert: Custom components used for styling and layout.
// ContactCard: Custom component for displaying individual contact information.
// ContactModal: Modal component for adding or editing contacts.
// Alert: For displaying success or error alerts.
// Functions
// useEffect:
// This hook is used to fetch the active contacts initially by calling the fetchActiveContacts function.
// handleAddContact:

// Description: Opens the modal to add a new contact. It clears the selected contact and triggers a refresh of the contact list.
// Action: Sets showModal to true, clears the selectedContact, and calls fetchActiveContacts to update the contact list.
// handleModalClose:

// Description: Closes the modal and refreshes the contact list.
// Action: Sets showModal to false, and calls fetchActiveContacts to update the list of active contacts.
// saveContact:

// Description: Handles saving the contact (either creating a new one or updating an existing one). This function calls the handleSave function and refreshes the contact list after saving.
// Action: Calls handleSave with the current contact data, updates the contact list, and closes the modal.
// handleChange:

// Description: Handles changes in the search input fields (name, first name, or mission). It updates the searchQuery state and triggers a search.
// Action: Calls handleSearchChange to update the search query and filter the contacts.
// handleToggleActiveInactive:

// Description: Toggles between showing active and inactive contacts.
// Action: Updates the isActive state and fetches the appropriate contacts using fetchActiveContacts or fetchInactiveContacts.
// fetchActiveContacts:

// Description: Fetches the list of active contacts.
// Action: Updates the contacts state and resets the noResultsMessage.
// fetchInactiveContacts:

// Description: Fetches the list of inactive contacts.
// Action: Updates the contacts state and resets the noResultsMessage.
// fetchSearchResults:

// Description: Handles search results fetching based on the current search query.
// Action: Filters the contacts by the searchQuery and updates the contact list.
// JSX Structure
// Search Section:

// Three MDInput components are used to search by nom, prenom, and mission. Each input is associated with the corresponding property in the searchQuery state.
// A button (MDButton) is used to clear the search inputs and reset the list of contacts.
// Active/Inactive Toggle:

// A Switch component allows toggling between active and inactive contacts. The current state is managed using the isActive state variable.
// Contacts Grid:

// A Grid layout displays the list of contacts. Each contact is displayed in a ContactCard component, and the edit functionality is handled with the onEdit function.
// Alert:

// If no contacts match the search query, an Alert is displayed with a "No Results" message.
// If there is any feedback to show (success or error), an MDAlert component is displayed in the bottom-right corner.
// Modal:

// The ContactModal is conditionally rendered based on the showModal state. It is used to add or edit a contact.

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
      handleToggleActiveInactive();
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
      setNoResultsMessage(''); // clear the no results message if any
      return newIsActive; // Update the state
    });
  };
  return (
    <div className="contact-list">
      <Card id="search-contacts">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox pr={1}>
            <div className="contact-list">
              <MDInput
                label="Recherche par nom"
                name="nom"
                value={searchQuery.nom}
                onChange={handleChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par prénom"
                name="prenom"
                value={searchQuery.prenom}
                onChange={handleChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par mission"
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
