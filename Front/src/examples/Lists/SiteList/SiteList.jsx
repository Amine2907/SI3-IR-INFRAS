import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { status_sfr, ops, regions, program, Status_Site } from './SiteData';
const SiteList = () => {
  const [sites, setsites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSite, setselectedSite] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [activeCompanies, setActiveCompanies] = useState([]);
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
    programme_fk: '',
    status_site_fk: '',
    Acteur_ENEDIS_id: '',
  });
  const navigate = useNavigate();
  const [noResultsMessage, setNoResultsMessage] = useState('');
  // Fetch active companies when the component mounts
  useEffect(() => {
    const fetchActiveCompanies = async () => {
      try {
        const result = await SiteService.getActiveCompanies();
        if (result.success) {
          setActiveCompanies(result.data); // Assuming result.data is an array of company objects
        } else {
          console.error('Error fetching active companies:', result.error);
          setActiveCompanies([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveCompanies([]);
      }
    };
    fetchActiveCompanies();
  }, []); // Empty dependency array to run once when the component mounts
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
      searchQuery.Operateurs.length > 0 ||
      searchQuery.programme_fk.length > 0 ||
      searchQuery.status_site_fk.length > 0 ||
      (searchQuery.Acteur_ENEDIS_id && searchQuery.Acteur_ENEDIS_id.length > 0)
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
        const Acteur_ENEDIS_id = Site.Acteur_ENEDIS_id
          ? String(Site.Acteur_ENEDIS_id)
              .toLowerCase()
              .includes(searchQuery.Acteur_ENEDIS_id.toLowerCase())
          : false;
        const Operateurs = Site.Operateurs
          ? String(Site.Operateurs).toLowerCase().includes(searchQuery.Operateurs.toLowerCase())
          : false;
        const region = Site.region
          ? Site.region.toLowerCase().includes(searchQuery.region.toLowerCase())
          : false;
        const status_site_fk = Site.status_site_fk
          ? String(Site.status_site_fk)
              .toLowerCase()
              .includes(searchQuery.status_site_fk.toLowerCase())
          : false;
        const programme_fk = Site.programme_fk
          ? String(Site.programme_fk).toLowerCase().includes(searchQuery.programme_fk.toLowerCase())
          : false;
        const code_postal = Site.code_postal
          ? String(Site.code_postal).toLowerCase().includes(searchQuery.code_postal.toLowerCase())
          : false;
        const Ville = Site.Ville
          ? Site.Ville.toLowerCase().includes(searchQuery.Ville.toLowerCase())
          : false;
        return (
          EB ||
          G2R ||
          nom ||
          code_postal ||
          Ville ||
          status_site_SFR ||
          region ||
          Operateurs ||
          programme_fk ||
          status_site_fk ||
          Acteur_ENEDIS_id
        );
      });
      return filteredsites; // Return filtered Sites
    }
    return sites; // Return original Sites if no search query
  };
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
  // fetch Inactive Sites
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
    console.log('Data being sent to createSite:', data);
    let result;
    let successMessage = '';
    // Create new entity
    result = await SiteService.createSite(data);
    successMessage = 'site enregistrée avec succès !';
    // Check if the operation was successful
    if (result?.success) {
      // Show success alert and reload active sites based on `isActive` status
      setAlert({ show: true, message: successMessage, type: 'success' });
      if (isActive) {
        await fetchActivesites();
      } else {
        await fetchInactivesites();
      }
      // Reset the active state and close the modal
      setIsActive(true); // Reset toggle state to Active
      handleModalClose();
    } else {
      // Show an error alert if saving failed
      setAlert({
        show: true,
        message: `Erreur: ${result?.error || "Échec de l'opération"}`,
        type: 'error',
      });
    }
  };
  const handleEdit = site => {
    navigate('/site-infos', { state: { EB: site.EB } });
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
  const handleSearchCompanies = event => {
    const { value } = event.target;
    console.log('Selected Acteur_ENEDIS_id:', value); // Check if the selected value is correct
    setSearchQuery(prevState => ({
      ...prevState,
      Acteur_ENEDIS_id: value,
    }));
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
  // handle Search Sites based on searchQuery
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
    console.log(sites);
  }, [sites]);
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
      searchQuery.Operateurs ||
      searchQuery.programme_fk ||
      searchQuery.status_site_fk ||
      searchQuery.Acteur_ENEDIS_id
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
                  label="status_site_SFR"
                >
                  {status_sfr.map(status_site_SFR => (
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
                  {ops.map(Operateurs => (
                    <MenuItem key={Operateurs} value={Operateurs}>
                      {Operateurs}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Dropdown for Program Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Program
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="programme_fk"
                  value={searchQuery.programme_fk}
                  onChange={handleSearchDropDown}
                  label="region"
                >
                  {program.map(programme_fk => (
                    <MenuItem key={programme_fk} value={programme_fk}>
                      {programme_fk}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Dropdown for Status Site SFR Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Status Site
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="status_site_fk"
                  value={searchQuery.status_site_fk}
                  onChange={handleSearchDropDown}
                  label="status_site_fk"
                >
                  {Status_Site.map(status_site_fk => (
                    <MenuItem key={status_site_fk} value={status_site_fk}>
                      {status_site_fk}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Acteur ENEDIS
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="Acteur_ENEDIS_id"
                  value={searchQuery.Acteur_ENEDIS_id || ''}
                  onChange={handleSearchCompanies}
                  label="Acteur_ENEDIS_id"
                >
                  {/* Map over activeCompanies to generate MenuItems */}
                  {activeCompanies.length > 0 ? (
                    activeCompanies.map(company => (
                      <MenuItem key={company.ENTid} value={company.ENTid}>
                        {' '}
                        {company.nom}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No active companies available</MenuItem>
                  )}
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
                    programme_fk: '',
                    status_site_fk: '',
                    Acteur_ENEDIS_id: '',
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
                    handleEdit(site);
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
        <SiteModal site={selectedSite} onSave={handleSave} onClose={handleModalClose} />
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
