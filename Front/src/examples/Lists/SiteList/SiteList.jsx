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
    nom: '',
    ville: '',
    region: '',
    code_postal: '',
    role: '',
  });
  const [noResultsMessage, setNoResultsMessage] = useState('');
  // Function to render the search results
  const renderSearch = () => {
    if (
      searchQuery.nom.length > 0 ||
      searchQuery.ville.length > 0 ||
      searchQuery.region.length > 0 ||
      searchQuery.code_postal.length > 0 ||
      searchQuery.role.length > 0
    ) {
      const filteredsites = sites.filter(Site => {
        const nom = Site.nom
          ? Site.nom.toLowerCase().includes(searchQuery.nom.toLowerCase())
          : false;
        const ville = Site.ville
          ? Site.ville.toLowerCase().includes(searchQuery.ville.toLowerCase())
          : false;
        const region = Site.region
          ? Site.region.toLowerCase().includes(searchQuery.region.toLowerCase())
          : false;
        const code_postal = Site.code_postal
          ? Site.code_postal.toLowerCase().includes(searchQuery.code_postal.toLowerCase())
          : false;
        const role = Site.role
          ? Site.role.toLowerCase().includes(searchQuery.role.toLowerCase())
          : false;
        return nom || ville || region || code_postal || role;
      });

      return filteredsites; // Return filtered Sites
    }
    return sites; // Return original Sites if no search query
  };
  const roles = [
    'Fournisseur',
    'CSPS',
    'Syndicat',
    'Pyloniste',
    'Génie Civiliste',
    'Géotechnicien',
    'Dronist',
    'Mairie',
  ];
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
  const handleRoleChange = e => {
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
      searchQuery.ville ||
      searchQuery.region ||
      searchQuery.code_postal ||
      searchQuery.role
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
                label="Recherche par nom"
                name="nom"
                value={searchQuery.nom}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par ville"
                name="ville"
                value={searchQuery.ville}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Recherche par region"
                name="region"
                value={searchQuery.region}
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
              {/* Dropdown for Role Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Role
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="role"
                  value={searchQuery.role}
                  onChange={handleRoleChange}
                  label="Role"
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <MDButton
                onClick={() => {
                  setNoResultsMessage('');
                  setSearchQuery({ nom: '', ville: '', region: '', code_postal: '', role: '' });
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
