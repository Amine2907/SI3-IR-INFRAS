// src/services/contactsFuncs.js

import contactService from 'services/contactsService'; // Import the contact service

// Function to fetch contacts based on the active state
export const fetchContacts = async (isActive, setContacts) => {
  try {
    const result = isActive
      ? await contactService.getActiveContacts()
      : await contactService.getInactiveContacts();
    if (result.success) {
      setContacts(result.data);
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
  }
};

// Function to handle adding a new contact
export const handleAddContact = (setSelectedContact, setShowModal) => {
  setSelectedContact(null);
  setShowModal(true);
};

// Function to handle saving contact data
export const handleSave = async (data, selectedContact, setAlert, handleModalClose) => {
  let result;
  let successMessage = '';

  if (selectedContact) {
    // Update contact
    result = await contactService.updateContact(selectedContact.id, data);
    successMessage = 'Contact updated successfully!';
  } else {
    // Create new contact
    result = await contactService.createContact(data);
    successMessage = 'Contact saved successfully!';
  }

  if (result.success) {
    setAlert({ show: true, message: successMessage, type: 'success' });
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
  }

  handleModalClose();
};

// Function to handle search query changes
export const handleSearchChange = (
  e,
  searchQuery,
  setSearchQuery,
  fetchContacts,
  isActive,
  setContacts
) => {
  const { name, value } = e.target;
  setSearchQuery(prev => ({ ...prev, [name]: value }));

  if (value === '') {
    fetchContacts(isActive, setContacts); // If search input is cleared, fetch active entities
  } else {
    handleSearchEntities(searchQuery, fetchContacts, setContacts); // If there's input, fetch filtered entities
  }
};

// Function to search contacts
export const handleSearchEntities = async (searchQuery, fetchContacts, setContacts) => {
  const result = await contactService.searchContacts(searchQuery);
  if (result.success) {
    setContacts(result.data); // Update contacts directly with search results
  } else {
    console.error(result.error);
  }
};

// Function to toggle active/inactive state
export const handleToggleActiveInactive = (
  prevIsActive,
  fetchContacts,
  setIsActive,
  setContacts
) => {
  const newIsActive = !prevIsActive; // Toggle the active state
  fetchContacts(newIsActive, setContacts); // Fetch contacts based on the new state
  setIsActive(newIsActive); // Update the state
};
