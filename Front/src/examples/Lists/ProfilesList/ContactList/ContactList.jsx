import React, { useEffect, useState } from 'react';
import ContactCard from '../../../Cards/ConatctCards/ContactCard';
import ContactModal from '../../../popup/ContactPopUp/ContactPopUpl';
import './ContactList.module.css';
import contactService from 'services/contactsService';
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
      <h2>Contacts</h2>
      <button onClick={handleAddContact}>Add New Contact</button>
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
