/**
 * This file contains functions to interact with the contacts feature.
 * The functions are:
 *
 * - fetchActiveContacts: Fetches all the active contacts from the database.
 * - fetchInactiveContacts: Fetches all the inactive contacts from the database.
 * - handleToggleActiveInactive: Toggles between displaying active and inactive contacts.
 * - handleSearchContacts: Fetches contacts matching the search query.
 * - handleSave: Saves a contact in the database or updates an existing one.
 */
import contactService from 'services/contactsService';

export const fetchActiveContacts = async (setContacts, setNoResultsMessage) => {
  setNoResultsMessage('');
  const result = await contactService.getActiveContacts();
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucun contact actif trouvé.');
    }
  } else {
    console.error(result.error);
    setNoResultsMessage(
      'Erreur lors de la récupération des contacts. Veuillez réessayer plus tard.'
    );
  }
};

export const fetchInactiveContacts = async (setContacts, setNoResultsMessage) => {
  const result = await contactService.getInactiveContacts();
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucun contact inactif trouvé.');
    }
  } else {
    console.error(result.error);
    setNoResultsMessage(
      'Erreur lors de la récupération des contacts. Veuillez réessayer plus tard.'
    );
  }
};

export const handleSave = async (
  data,
  selectedContact,
  setAlert,
  isActive,
  setContacts,
  setNoResultsMessage,
  handleModalClose
) => {
  let result;
  let successMessage = '';

  if (selectedContact) {
    result = await contactService.updateContact(selectedContact.Cid, data);
    successMessage = 'Contact mis à jour avec succès !';
  } else {
    result = await contactService.createContact(data);
    successMessage = 'Contact enregistré avec succès !';
  }

  if (result.success) {
    handleModalClose();
    setAlert({ show: true, message: successMessage, type: 'success' });
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
  }

  if (isActive) {
    fetchActiveContacts(setContacts, setNoResultsMessage);
  } else {
    fetchInactiveContacts(setContacts, setNoResultsMessage);
  }
};

export const handleSearchChange = (
  e,
  searchQuery,
  setSearchQuery,
  setContacts,
  setNoResultsMessage,
  handleSearchContacts
) => {
  const { name, value } = e.target;
  setSearchQuery(prev => ({ ...prev, [name]: value }));

  if (value === '') {
    fetchActiveContacts(setContacts, setNoResultsMessage); // If search input is cleared, fetch active entities
  } else {
    handleSearchContacts(searchQuery, setContacts, setNoResultsMessage);
  }
};

export const handleSearchContacts = async (searchQuery, setContacts, setNoResultsMessage) => {
  const result = await contactService.searchContacts(searchQuery);
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('Aucun contact trouvé pour les critères de recherche spécifiés.');
    } else {
      setNoResultsMessage('');
    }
  } else {
    console.error(result.error);
  }
};
