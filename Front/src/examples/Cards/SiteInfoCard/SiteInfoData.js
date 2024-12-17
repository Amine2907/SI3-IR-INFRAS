import contactService from 'services/Contacts/contactsService';
import siteContactService from 'services/Site_Services/siteContactService';
import SiteService from 'services/Site_Services/siteService';
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
export {
  program,
  Status_Site,
  priority,
  fetchCompanyNameById,
  fetchContactNameById,
  getContactsSite,
  getAciveContacts,
  performSiteContactAction,
};
