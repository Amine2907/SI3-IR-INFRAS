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
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
  const renderSearch = () => {
    let filteredSites = sites;

    if (searchText.trim()) {
      filteredSites = filteredSites.filter(site => {
        const lowerCaseQuery = searchText.toLowerCase();
        const combinedFields = [
          site.EB,
          site.G2R,
          site.nom,
          site.code_postal,
          site.Ville,
          site.status_site_SFR,
          site.region,
          site.Operateurs,
          site.programme_fk,
          site.status_site_fk,
          site.Acteur_ENEDIS_id,
        ]
          .filter(Boolean)
          .map(field => field.toString().toLowerCase())
          .join(' ');

        return combinedFields.includes(lowerCaseQuery);
      });
    }

    if (Object.keys(searchQuery).length > 0) {
      console.log('Applying Filters:', searchQuery); // Log filters being applied
      filteredSites = filteredSites.filter(site =>
        Object.entries(searchQuery).every(([key, value]) => {
          console.log(`Comparing site[${key}] (${site[key]}) with value (${value})`); // Debug log
          if (!value) return true;
          if (!site[key]) return false;
          return (
            site[key].toString().toLowerCase().trim() === value.toString().toLowerCase().trim()
          );
        })
      );
    }

    return filteredSites;
  };

  const filteredSites = renderSearch();
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

    setSearchQuery(prev => ({
      ...prev,
      [name]: value || '',
    }));
  };
  const handleSearchCompanies = event => {
    const { value } = event.target;
    setSearchQuery(prevState => ({
      ...prevState,
      Acteur_ENEDIS_id: value,
    }));
  };
  const handleSearchChange = e => {
    const { value } = e.target; // Get the value from the input
    setSearchText(value); // Set it to the text-specific state
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
    const filteredSites = renderSearch();
    if (filteredSites.length === 0) {
      setNoResultsMessage('Aucune site trouvée pour les critères de recherche spécifiés.');
    } else {
      setNoResultsMessage(''); // Clear message if results are found
    }
  }, [searchText, searchQuery, sites]);
  useEffect(() => {
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

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 10000); // Auto-dismiss after 10 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [alert]);
  return (
    <div className="Site-list">
      <Card id="search-Site">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox pr={1}>
            <div className="Site-list">
              <MDBox
                pt={2}
                px={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDInput
                  label="Recherche par Nom, EB, G2R, Code Postal, Ville"
                  value={searchText} // Use searchText here
                  onChange={handleSearchChange} // Update searchText on change
                  style={{ width: '100%', marginBottom: '10px' }}
                />
              </MDBox>
              {/* Dropdown for Status Site SFR Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Status Site SFR
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="status_site_SFR"
                  value={searchQuery.status_site_SFR || ''}
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
                  value={searchQuery.region || ''}
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
                  value={searchQuery.Operateurs || ''}
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
                  value={searchQuery.programme_fk || ''}
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
                  value={searchQuery.status_site_fk || ''}
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
                  setSearchText('');
                  setSearchQuery('');
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
            {filteredSites.length > 0
              ? filteredSites.map(site => (
                  <Grid item xs={12} sm={8} md={4} key={site.EB}>
                    <SiteCard
                      site={site}
                      onEdit={() => {
                        handleEdit(site);
                      }}
                    />
                  </Grid>
                ))
              : noResultsMessage && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{noResultsMessage}</AlertDescription>
                  </Alert>
                )}
          </Grid>
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
