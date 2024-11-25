/* eslint-disable */
import { useState, useEffect } from 'react';
import {
  getContactsSite,
  getAciveContacts,
  fetchContactNameById,
  fetchCompanyNameById,
} from './SiteInfoData';

const SiteInfoFuncs = site => {
  // Local states and constants
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showContactModel, setShowContactModel] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [formData, setFormData] = useState({ contact_fk: [] });
  const [activeContacts, setActiveContacts] = useState([]);
  const [contactSite, setContactSite] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [contactToDeleteCid, setContactToDeleteCid] = useState(null);
  const [errors, setErrors] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchContactsSite = async () => {
    // Fetch the contact site and active contacts
    const response = await getContactsSite(site.EB);
    setContactSite(response.data);

    const contactsResponse = await getAciveContacts();
    setActiveContacts(contactsResponse.data);

    if (site.Acteur_ENEDIS_id) {
      const company = await fetchCompanyNameById(site.Acteur_ENEDIS_id);
      setCompanyName(company);
    }
  };

  useEffect(() => {
    fetchContactsSite();
  }, [site]);

  // Handle contact change (multi-select)
  const handleContactsChange = event => {
    setFormData({ ...formData, contact_fk: event.target.value });
  };

  // Add new contact (opens modal)
  const handleAddContact = () => {
    setShowModal(true);
  };

  // Close modal
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedContact(null);
    setErrors({});
  };

  // Save new contact
  const handleSave = async () => {
    // Handle saving new contact here
    setShowModal(false);
  };

  // Toggle expand section for extra information
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Edit a contact
  const handleEdit = contactId => {
    // Fetch and show selected contact details
    setSelectedContact(contactId);
    setShowContactModel(true);
  };

  // Open delete modal
  const handleOpenDeleteModal = contactId => {
    setContactToDeleteCid(contactId);
    setAlert({
      show: true,
      type: 'error',
      message: 'Are you sure you want to delete this contact?',
    });
  };

  // Delete contact
  const handleDelete = async contactId => {
    // API call to delete contact
    // Remove the contact from the local state once deleted
    const updatedContacts = contactSite.filter(contact => contact.Cid !== contactId);
    setContactSite(updatedContacts);
    setAlert({
      show: true,
      type: 'success',
      message: 'Contact successfully deleted',
    });
  };

  // Associate selected contacts to site
  const handleAssociateContacts = async contactIds => {
    // Perform association logic
    // Example API call to associate contacts to the site
    await fetchContactNameById(contactIds);
    setAlert({
      show: true,
      type: 'success',
      message: 'Contacts successfully associated with the site',
    });
  };

  // Close alert
  const handleCloseAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  return {
    handleContactsChange,
    handleAddContact,
    handleModalClose,
    handleSave,
    handleToggleExpand,
    handleEdit,
    handleOpenDeleteModal,
    handleDelete,
    handleAssociateContacts,
    fetchContactsSite,
    alert,
    showModal,
    showDropDown,
    contactSite,
    formData,
    activeContacts,
    companyName,
    selectedContact,
    isExpanded,
    expanded: isExpanded,
    handleCloseAlert,
  };
};

export default SiteInfoFuncs;
