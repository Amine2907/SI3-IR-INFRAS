/**
 * SiteList component
 *
 * This component renders a list of Sites with search and filter capabilities.
 * Users can toggle between active and inactive Sites, search by multiple criteria,
 * and add or edit Sites via a modal form.
 *
 * State Variables:
 * - sites: Array of Sites to be displayed.
 * - showModal: Boolean indicating whether the entity modal is visible.
 * - selectedSite: The currently selected entity for editing, or null for adding a new entity.
 * - alert: Object containing alert visibility, message, and type.
 * - isActive: Boolean indicating whether active Sites are displayed.
 * - searchQuery: Object containing search fields for filtering Sites.
 * - noResultsMessage: Message displayed when no Sites match the search criteria.
 *
 * Functions:
 * - renderSearch: Filters Sites based on the search query.
 * - fetchActivesites: Fetches and updates the list of active Sites.
 * - fetchInactivesites: Fetches and updates the list of inactive Sites.
 * - handleAddSite: Opens the modal for adding a new entity.
 * - handleModalClose: Closes the modal and refreshes the entity list.
 * - handleSave: Saves a new or edited entity and updates the list.
 * - handleCloseAlert: Closes the alert notification.
 * - handleRoleChange: Updates search query based on role selection.
 * - handleSearchChange: Updates search query and fetches Sites based on input.
 * - handleSearchSites: Fetches Sites matching the search query.
 * - handleToggleActiveInactive: Toggles between displaying active and inactive Sites.
 *
 * The component uses Material Dashboard 2 React components and Material UI for styling.
 */
import React, { useEffect, useState } from 'react';
// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Grid, Switch } from '@mui/material';
import MDInput from 'components/MDInput';
import MDAlert from 'components/MDAlert';
import SiteCard from 'examples/Cards/SiteCard';
import SiteModal from 'examples/popup/SitePopUp';
import { FormControl, MenuItem, Select } from '@mui/material';
import { Alert, AlertDescription } from 'components/ui/alert';
import SiteService from 'services/Site_Services/siteService';
const SiteList = () => {
  const [sites, setsites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSite, setselectedSite] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isActive, setIsActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    EB: '',
    G2R: '',
    nom: '',
    code_postal: '',
    Ville: '',
    status_site_SFR: '',
    region: '',
    Operateurs: '',
  });
  const [noResultsMessage, setNoResultsMessage] = useState('');
  // Function to render the search results
  const renderSearch = () => {
    if (
      searchQuery.status_site_SFR.length > 0 ||
      searchQuery.EB.length > 0 ||
      searchQuery.G2R.length > 0 ||
      searchQuery.Ville.length > 0 ||
      searchQuery.code_postal.length > 0 ||
      searchQuery.nom.length > 0 ||
      searchQuery.region.length > 0 ||
      searchQuery.Operateurs.length > 0
    ) {
      const filteredsites = sites.filter(Site => {
        const EB = Site.EB ? Site.EB.toLowerCase().includes(searchQuery.EB.toLowerCase()) : false;
        const G2R = Site.G2R
          ? Site.G2R.toLowerCase().includes(searchQuery.G2R.toLowerCase())
          : false;
        const nom = Site.nom
          ? Site.nom.toLowerCase().includes(searchQuery.nom.toLowerCase())
          : false;
        const status_site_SFR = Site.status_site_SFR
          ? Site.status_site_SFR.toLowerCase().includes(searchQuery.status_site_SFR.toLowerCase())
          : false;
        const Operateurs = Site.Operateurs
          ? String(Site.Operateurs).toLowerCase().includes(searchQuery.Operateurs.toLowerCase())
          : false;
        const region = Site.region
          ? Site.region.toLowerCase().includes(searchQuery.region.toLowerCase())
          : false;
        const code_postal = Site.code_postal
          ? String(Site.code_postal).toLowerCase().includes(searchQuery.code_postal.toLowerCase())
          : false;
        const Ville = Site.Ville
          ? Site.Ville.toLowerCase().includes(searchQuery.Ville.toLowerCase())
          : false;
        return EB || G2R || nom || code_postal || Ville || status_site_SFR || region || Operateurs;
      });

      return filteredsites; // Return filtered Sites
    }
    return sites; // Return original Sites if no search query
  };
  // Dictionnary for searching dorpdowns ( site page )
  // const Status_Site = ['Activé', 'Inactif', 'Terminé'];
  const Status_Site_SFR = [
    '0.Bloquée/Suspendu MAD',
    '0.Bloquée/Suspendu Conv',
    '0.Bloquée/Suspendu DP',
    '1.En Recherche',
    '2.En validation',
    '3.Validé',
    '3.En Conception',
    '4.En cours conception',
    '4.GO Constr. Anticipé',
    '5.En attente visées FH',
    '5.GO Constructibilité',
    '6.GO Constructibilité',
    '6.Mad Infra',
    '7.GO Constructibilité Anticipé',
    '7.MES',
    '8.Annulé',
    '8.PEM',
    'En service',
  ];
  const operateurs = ['SFR', 'ORANGE', 'FREE', 'Bouygues Telecom'];
  const regions = [
    'Auvergne-Rhône-Alpes',
    'Bourgogne-Franche-Comté',
    'Bretagne',
    'Centre-Val de Loire',
    'Corse',
    'Grand-Est',
    'Guadeloupe',
    'Guyane',
    'Hauts-de-France',
    'Ile-de-France',
    'Martinique',
    'Normandie',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Pays de la Loire',
    'Provence-Alpes-Cote-dAzur',
  ];
  // const program = [
  //   '4GFixe',
  //   'DCC',
  //   'ARP',
  //   'DENSIF_CZ_RED',
  //   'DENSIF_CZ',
  //   'ZTD_RED',
  //   'PAC-REMP',
  //   'PAC',
  //   'PAC-DUP',
  //   'PAC-CONTINUITY-PLAN',
  //   'FM',
  //   'ORF',
  //   'SFR TT',
  //   'FM TT',
  // ];
  // const Acteur_ENEDIS = [

  // ];
  // Fetch Active and Inactive Sites
  const fetchActivesites = async () => {
    setNoResultsMessage('');
    const result = await SiteService.getActiveSites();
    if (result.success) {
      setsites(result.data); // Update your sites state here
      if (result.data.length === 0) {
        setNoResultsMessage('Aucune site active trouvée.');
      }
    } else {
      console.error(result.error);
      setNoResultsMessage(
        'Erreur lors de la récupération des sites. Veuillez réessayer plus tard.'
      );
    }
  };
  const fetchInactivesites = async () => {
    const result = await SiteService.getInactiveSites();
    if (result.success) {
      setsites(result.data);
      if (result.data.length === 0) {
        setNoResultsMessage('Aucune site inactive trouvée.');
      } // Update your sites state here
    } else {
      console.error(result.error);
      setNoResultsMessage(
        'Erreur lors de la récupération des sites. Veuillez réessayer plus tard.'
      );
    }
  };
  // Function to handle adding Sites
  const handleAddSite = () => {
    setselectedSite(null); // Clear selected entity for new entry
    setShowModal(true); // Show modal for adding a new entity
    fetchActivesites(); // Refresh entity list after adding/editing
  };

  // Function to close modal
  const handleModalClose = () => {
    setShowModal(false); // Hide modal
    fetchActivesites(); // Refresh entity list after adding/editing
  };

  // Function to handle saving entity
  const handleSave = async data => {
    let result;
    let successMessage = '';
    if (selectedSite) {
      // Update entity
      result = await SiteService.updateSite(selectedSite.EB, data);
      successMessage = 'site mise à jour avec succès !';
    } else {
      // Create new entity
      result = await SiteService.createSite(data);
      successMessage = 'site enregistrée avec succès !';
    }
    // Handle the result with alert feedback
    if (result.success) {
      setAlert({ show: true, message: successMessage, type: 'success' });
      fetchActivesites();
    } else {
      setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
      fetchActivesites();
    }
    handleModalClose();
    if (isActive) {
      fetchActivesites(); // Fetch active Sites
    } else {
      fetchInactivesites(); // Fetch inactive Sites
    }
    fetchActivesites();
    setIsActive(true); // Set the switch state to Active after modifying an entity
  };

  // Function to close the alert
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  // Search Role
  const handleSearchDropDown = e => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setSearchQuery(prev => ({ ...prev, [name]: value }));
  };
  // Search functionality
  const handleSearchChange = e => {
    const { name, value } = e.target; // Destructure name and value from the event target
    // Update searchQuery with the new value
    setSearchQuery(prev => {
      const updatedQuery = { ...prev, [name]: value }; // Update only the field that changed
      console.log('Updated searchQuery:', updatedQuery); // Log the updated searchQuery
      return updatedQuery; // Return the updated state
    });
    // If the input is cleared, fetch active Sites
    if (value === '') {
      fetchActivesites();
    } else {
      handleSearchSites(); // Otherwise, fetch Sites based on the search query
    }
  };
  const handleSearchSites = async () => {
    try {
      if (!searchQuery || typeof searchQuery !== 'object') {
        console.error('Invalid searchQuery: searchQuery must be an object');
        return;
      }
      const result = await SiteService.searchSites(searchQuery);
      if (result.success) {
        setsites(result.data);
        // Show message if no contacts are found
        if (result.data.length === 0) {
          setNoResultsMessage('Aucune site trouvée pour les critères de recherche spécifiés.');
        } else {
          setNoResultsMessage(''); // Clear message if results are found
        }
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error while searching Sites:', error);
    }
  };
  // Toggle active/inactive Sites
  const handleToggleActiveInactive = async () => {
    setIsActive(prevIsActive => {
      const newIsActive = !prevIsActive; // Toggle the active state
      // Fetch Sites based on the new state
      if (newIsActive) {
        fetchActivesites();
      } else {
        fetchInactivesites();
      }
      setNoResultsMessage(''); // clear the no results message if any
      return newIsActive; // Update the state
    });
  };
  useEffect(() => {
    console.log('Updated searchQuery:', searchQuery); // Ensure `searchQuery` is updated
    if (
      searchQuery.nom ||
      searchQuery.EB ||
      searchQuery.G2R ||
      searchQuery.code_postal ||
      searchQuery.Ville ||
      searchQuery.status_site_SFR ||
      searchQuery.region ||
      searchQuery.Operateurs
    ) {
      handleSearchSites();
    } else {
      fetchActivesites(); // Clear filters if all fields are empty
    }
  }, [searchQuery]);
  // Render filtered Sites
  const filteredsites = renderSearch();
  return (
    <div className="Site-list">
      <Card id="search-Site">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox pr={1}>
            <div className="Site-list">
              <MDInput
                label="Recherche par EB"
                name="EB"
                value={searchQuery.EB}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par G2R"
                name="G2R"
                value={searchQuery.G2R}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par nom du site"
                name="nom"
                value={searchQuery.nom}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par code postal"
                name="code_postal"
                value={searchQuery.code_postal}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par ville"
                name="Ville"
                value={searchQuery.Ville}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              {/* Dropdown for Status Site SFR Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Status Site SFR
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="status_site_SFR"
                  value={searchQuery.status_site_SFR}
                  onChange={handleSearchDropDown}
                  label="Status_Site_SFR"
                >
                  {Status_Site_SFR.map(status_site_SFR => (
                    <MenuItem key={status_site_SFR} value={status_site_SFR}>
                      {status_site_SFR}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Dropdown for Region Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Region
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="region"
                  value={searchQuery.region}
                  onChange={handleSearchDropDown}
                  label="region"
                >
                  {regions.map(region => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Dropdown for Operateurs Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Operateurs
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="Operateurs"
                  value={searchQuery.Operateurs}
                  onChange={handleSearchDropDown}
                  label="Operateurs"
                >
                  {operateurs.map(Operateurs => (
                    <MenuItem key={Operateurs} value={Operateurs}>
                      {Operateurs}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <MDButton
                onClick={() => {
                  setNoResultsMessage('');
                  setSearchQuery({
                    EB: '',
                    G2R: '',
                    nom: '',
                    code_postal: '',
                    Ville: '',
                    status_site_SFR: '',
                    region: '',
                    Operateurs: '',
                  });
                }}
                variant="gradient"
                color="dark"
              >
                Effacer la recherche
              </MDButton>
            </div>
          </MDBox>
          <MDButton onClick={handleAddSite} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
            &nbsp;Ajouter site
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
            {filteredsites.map(site => (
              <Grid item xs={12} sm={8} md={4} key={site.EB}>
                <SiteCard
                  site={site}
                  onEdit={() => {
                    setselectedSite(site);
                    setShowModal(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
          {/* Conditionally render the no results alert */}
          {noResultsMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{noResultsMessage}</AlertDescription>
            </Alert>
          )}
        </MDBox>
      </Card>
      {showModal && (
        <SiteModal Site={selectedSite} onSave={handleSave} onClose={handleModalClose} />
      )}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={handleCloseAlert}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}
    </div>
  );
};
export default SiteList;
