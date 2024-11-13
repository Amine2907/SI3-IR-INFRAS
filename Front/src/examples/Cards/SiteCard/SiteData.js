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
const fetchCompanyNameById = async id => {
  try {
    const result = await SiteService.getActiveCompanies();
    if (result.success) {
      // Find the company by id
      const company = result.data.find(company => company.id === id);
      // Return the name if found, otherwise return a fallback
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
export { program, Status_Site, priority, fetchCompanyNameById };
