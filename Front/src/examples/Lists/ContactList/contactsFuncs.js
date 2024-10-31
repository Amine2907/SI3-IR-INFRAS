// contactFunctions.js
import contactService from 'services/contactsService';

export const fetchActiveContacts = async (setContacts, setNoResultsMessage) => {
  setNoResultsMessage('');
  const result = await contactService.getActiveContacts();
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('No active contacts found.');
    }
  } else {
    console.error(result.error);
    setNoResultsMessage('Error fetching contacts. Please try again later.');
  }
};

export const fetchInactiveContacts = async (setContacts, setNoResultsMessage) => {
  const result = await contactService.getInactiveContacts();
  if (result.success) {
    setContacts(result.data);
    if (result.data.length === 0) {
      setNoResultsMessage('No inactive contacts found.');
    }
  } else {
    console.error(result.error);
    setNoResultsMessage('Error fetching contacts. Please try again later.');
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
    successMessage = 'Contact updated successfully!';
  } else {
    result = await contactService.createContact(data);
    successMessage = 'Contact saved successfully!';
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
      setNoResultsMessage('No contacts found for the specified search criteria.');
    } else {
      setNoResultsMessage('');
    }
  } else {
    console.error(result.error);
  }
};
