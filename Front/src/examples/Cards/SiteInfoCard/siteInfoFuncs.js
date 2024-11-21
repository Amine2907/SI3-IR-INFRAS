// siteInfoCardLogic.js
import { useState, useEffect } from 'react';
import contactService from 'services/contactsService';
import siteContactService from 'services/Site_Services/siteContactService';
import SiteService from 'services/Site_Services/siteService';
export const useSiteInfoCardLogic = (site) => {
  const [companyName, setCompanyName] = useState('N/A');
  const [expanded, setExpanded] = useState(false);
  const [contactName, setContactName] = useState('N/A');
  const [activeContacts, setActiveContacts] = useState([]);
  const [formData, setFormData] = useState(site || { contact_fk: [] });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [showContactModel, setShowContactModel] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactSite, setContactSite] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [contactToDeleteCid, setContactToDeleteCid] = useState(null);

  useEffect(() => {
    const fetchContactsSite = async () => {
      const Sid = site.EB;
      if (Sid) {
        try {
          const contactSite = await getContactsSite(Sid);
          setContactSite(contactSite.contacts?.data || []);
        } catch (error) {
          console.error('Error fetching contacts:', error);
          setContactSite([]);
        }
      } else {
        setContactSite([]);
      }
    };
    fetchContactsSite();
  }, [site.EB]);

  useEffect(() => {
    const fetchActiveContacts = async () => {
      try {
        const fetchedContacts = await getAciveContacts();
        setActiveContacts(fetchedContacts);
      } catch (error) {
        console.error('Error fetching active contacts:', error.message);
      }
    };
    fetchActiveContacts();
  }, []);

  useEffect(() => {
    const fetchContactByName = async () => {
      const contactId = site.contact_fk;
      if (contactId) {
        const name = await fetchContactNameById(contactId);
        setContactName(name);
      }
    };
    fetchContactByName();
  }, [site.contact_fk]);

  useEffect(() => {
    const fetchCompanyName = async () => {
      const acteurId = site.Acteur_ENEDIS_id;
      if (acteurId) {
        const name = await fetchCompanyNameById(acteurId);
        setCompanyName(name);
      }
    };
    fetchCompanyName();
  }, [site.Acteur_ENEDIS_id]);

  const handleContactsChange = (event) => {
    setFormData({ ...formData, contact_fk: event.target.value });
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowContactModel(false);
    setShowWarning(false);
    setSelectedContact(null);
  };

  const handleSave = async (data) => {
    const { contactData } = data;
    const Sid = site.EB;
    try {
      const result = await siteContactService.addNewContactSite({ Sid, contactData });
      if (result.success) {
        setAlert({ show: true, message: 'Contact saved successfully!', type: 'success' });
        await fetchContactsSite();
      } else {
        setAlert({ show: true, message: `Error: ${result.error || 'Unknown error'}`, type: 'error' });
      }
    } catch (error) {
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    } finally {
      handleModalClose();
    }
  };
  const handleOpenDeleteModal = (Cid) => {
    setContactToDeleteCid(Cid);
    setShowWarning(true);
  };
  const handleDelete = async (Cid) => {
    setShowWarning(false);
    const Sid = site.EB;
    if (!Cid) {
      setAlert({ show: true, message: 'Contact ID is required', type: 'error' });
      return;
    }
    try {
      const response = await performSiteContactAction('deleteContact', Sid, { Cid });
      if (response.success) {
        setContactSite((prevContacts) => prevContacts.filter((contact) => contact.Contacts.Cid !== Cid));
        setAlert({ show: true, message: 'Contact deleted successfully!', type: 'success' });
      } else {
        setAlert({ show: true, message: response.error || 'An error occurred during deletion.', type: 'error' });
      }
    } catch (error) {
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    }
  };
  const handleAssociateContacts = async (selectedContacts) => {
    const siteId = site.EB;
    if (!selectedContacts || selectedContacts.length === 0) {
      setAlert({ show: true, message: 'Please select at least one valid contact.', type: 'error' });
      return;
    }
    try {
      const payload = { Sid: siteId, Cids: selectedContacts };
      const response = await siteContactService.addExistingSiteContacts(payload);
      if (response.success) {
        setAlert({ show: true, message: 'Contacts associated successfully!', type: 'success' });
        await fetchContactsSite();
      } else {
        setAlert({ show: true, message: `Failed to associate contacts: ${response.error}`, type: 'error' });
      }
    } catch (error) {
      setAlert({ show: true, message: 'Failed to associate contacts.', type: 'error' });
    }
  };
  const program = {
    1: '4GFixe',
    2: 'DCC',
    3: 'ARP',
    4: 'DENSIF_CZ_RED',
    5: 'DENSIF_CZ',
    6: 'ZTD_RED',
    7: 'PAC-REMP',
    8: 'PAC',
    9: 'PAC-DUP',
    10: 'PAC-CONTINUITY-PLAN',
    11: 'FM',
    12: 'ORF',
    13: 'SFR TT',
    14: 'FM TT',
  };
  const priority = { 1: 'P00', 2: 'P0', 3: 'P1', 4: 'P2' };
  const Status_Site = { 1: 'Activé', 2: 'Inactif', 3: 'Terminé' };
  const fetchCompanyNameById = async acteurId => {
    try {
      const result = await SiteService.getActiveCompanies();
      if (result.success) {
        // Look for a company where ENTid matches Acteur_ENEDIS_id
        const company = result.data.find(company => company.ENTid === acteurId);
        return company ? company.nom : 'N/A';
      } else {
        console.error('Error fetching active companies:', result.error);
        return 'N/A';
      }
    } catch (error) {
      console.error('Error during fetch:', error.message);
      return 'N/A';
    }
  };
  const fetchContactNameById = async contactId => {
    try {
      const result = await contactService.getActiveContacts();
      if (result.success) {
        const contact = result.data.find(contact => contact.id === contactId);
        return contact ? contact.nom : 'N/A';
      } else {
        console.error('Error fetching active contacts:', result.error);
        return 'N/A';
      }
    } catch (error) {
      console.error('Error during fetch:', error.message);
      return 'N/A';
    }
  };
  const getContactsSite = async Sid => {
    try {
      const result = await siteContactService.getContactsSite(Sid);
      if (result.success) {
        return result.data;
      } else {
        console.error('Error fetching site contacts:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error during fetch:', error.message);
      return [];
    }
  };
  const getAciveContacts = async () => {
    try {
      const result = await contactService.getActiveContacts();
      if (result.success) {
        return result.data;
      } else {
        console.error('Error fetching active contacts:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error during fetch:', error.message);
      return [];
    }
  };
  const performSiteContactAction = async (action, Sid, params = {}) => {
    if (!Sid) {
      return { success: false, error: 'Site ID is required' };
    }
    try {
      let response;
      switch (action) {
        case 'fetchContacts':
          response = await siteContactService.displayContactsSite(Sid);
          break;
        case 'deleteContact':
          if (!params.Cid) {
            throw new Error('Contact ID is required for deletion');
          }
          response = await siteContactService.deleteContactSite(Sid, params.Cid);
          break;
        default:
          throw new Error('Invalid action specified');
      }
      return response; // Return the response for further processing
    } catch (error) {
      console.error(`Error during ${action}:`, error.message);
      return { success: false, error: error.message };
    }
  };
  return {
    companyName,
    contactName,
    activeContacts,
    formData,
    alert,
    showModal,
    showContactModel,
    selectedContact,
    contactSite,
    expanded,
    showWarning,
    contactToDeleteCid,
    handleContactsChange,
    handleToggleExpand,
    handleAddContact,
    handleModalClose,
    handleSave,
    handleOpenDeleteModal,
    handleDelete,
    handleAssociateContacts,
    program,
    Status_Site,
    priority,
    fetchCompanyNameById,
    fetchContactNameById,
    getContactsSite,
    getAciveContacts,
    performSiteContactAction,
  };
};
