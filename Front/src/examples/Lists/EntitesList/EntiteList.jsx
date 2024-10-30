import React, { useEffect, useState } from 'react';
import entityService from 'services/entityService';
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
import EntiteCard from 'examples/Cards/EntiteCard/EntiteCard';
import EntiteModal from 'examples/popup/EntitePopUp/EntitePopUp';
import { FormControl, MenuItem, Select } from '@mui/material';
import { Alert, AlertDescription } from 'components/ui/alert';
const EntiteList = () => {
  const [entites, setEntites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
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
      const filteredEntites = entites.filter(entite => {
        const nom = entite.nom
          ? entite.nom.toLowerCase().includes(searchQuery.nom.toLowerCase())
          : false;
        const ville = entite.ville
          ? entite.ville.toLowerCase().includes(searchQuery.ville.toLowerCase())
          : false;
        const region = entite.region
          ? entite.region.toLowerCase().includes(searchQuery.region.toLowerCase())
          : false;
        const code_postal = entite.code_postal
          ? entite.code_postal.toLowerCase().includes(searchQuery.code_postal.toLowerCase())
          : false;
        const role = entite.role
          ? entite.role.toLowerCase().includes(searchQuery.role.toLowerCase())
          : false;
        return nom || ville || region || code_postal || role;
      });

      return filteredEntites; // Return filtered entities
    }
    return entites; // Return original entities if no search query
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
  // Fetch Active and Inactive entities
  const fetchActiveEntites = async () => {
    setNoResultsMessage('');
    const result = await entityService.getActiveEntites();
    if (result.success) {
      setEntites(result.data); // Update your entites state here
    } else {
      console.error(result.error);
    }
  };
  const fetchInactiveEntites = async () => {
    const result = await entityService.getInactiveEntites();
    if (result.success) {
      setEntites(result.data); // Update your entites state here
    } else {
      console.error(result.error);
    }
  };
  // Function to handle adding entities
  const handleAddEntite = () => {
    setSelectedEntity(null); // Clear selected entity for new entry
    setShowModal(true); // Show modal for adding a new entity
  };

  // Function to close modal
  const handleModalClose = () => {
    setShowModal(false); // Hide modal
    fetchActiveEntites(); // Refresh entity list after adding/editing
  };

  // Function to handle saving entity
  const handleSave = async data => {
    let result;
    let successMessage = '';
    if (selectedEntity) {
      // Update entity
      console.log('Updating entity:', selectedEntity.Eid);
      result = await entityService.updateEntity(selectedEntity.Eid, data);
      successMessage = 'Entité updated successfully!';
    } else {
      // Create new entity
      result = await entityService.createEntity(data);
      successMessage = 'Entité saved successfully!';
    }

    // Handle the result with alert feedback
    if (result.success) {
      setAlert({ show: true, message: successMessage, type: 'success' });
    } else {
      setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
    }
    handleModalClose();
    if (isActive) {
      fetchActiveEntites(); // Fetch active entities
    } else {
      fetchInactiveEntites(); // Fetch inactive entities
    }
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
    // If the input is cleared, fetch active entities
    if (value === '') {
      fetchActiveEntites();
    } else {
      handleSearchEntities(); // Otherwise, fetch entities based on the search query
    }
  };
  const handleSearchEntities = async () => {
    try {
      if (!searchQuery || typeof searchQuery !== 'object') {
        console.error('Invalid searchQuery: searchQuery must be an object');
        return;
      }
      const result = await entityService.searchEntities(searchQuery);
      if (result.success) {
        setEntites(result.data);
        // Show message if no contacts are found
        if (result.data.length === 0) {
          setNoResultsMessage('No contacts found for the specified search criteria.');
        } else {
          setNoResultsMessage(''); // Clear message if results are found
        }
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error while searching entities:', error);
    }
  };
  // Toggle active/inactive entities
  const handleToggleActiveInactive = async () => {
    setIsActive(prevIsActive => {
      const newIsActive = !prevIsActive; // Toggle the active state
      // Fetch entities based on the new state
      if (newIsActive) {
        fetchActiveEntites();
      } else {
        fetchInactiveEntites();
      }
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
      handleSearchEntities();
    } else {
      fetchActiveEntites(); // Clear filters if all fields are empty
    }
  }, [searchQuery]);
  // Render filtered entities
  const filteredEntites = renderSearch();
  return (
    <div className="entite-list">
      <Card id="delete-account">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox pr={1}>
            <div className="entite-list">
              <MDInput
                label="Search by name "
                name="nom"
                value={searchQuery.nom}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Search by ville"
                name="ville"
                value={searchQuery.ville}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Search by region"
                name="region"
                value={searchQuery.region}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDInput
                label="Search by code postal "
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
                  fetchActiveEntites();
                }}
                variant="gradient"
                color="dark"
              >
                Clear Search
              </MDButton>
            </div>
          </MDBox>
          <MDButton onClick={handleAddEntite} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
            &nbsp;Ajouter Entité
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
            {filteredEntites.map(entite => (
              <Grid item xs={12} sm={8} md={4} key={entite.id}>
                <EntiteCard
                  entite={entite}
                  onEdit={() => {
                    setSelectedEntity(entite);
                    setShowModal(true);
                  }}
                />
              </Grid>
            ))}
          </Grid>
          {/* Conditionally render the no results alert */}
          {noResultsMessage && (
            <Alert variant="success" className="mt-4">
              <AlertDescription>{noResultsMessage}</AlertDescription>
            </Alert>
          )}
        </MDBox>
      </Card>
      {showModal && (
        <EntiteModal entite={selectedEntity} onSave={handleSave} onClose={handleModalClose} />
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
export default EntiteList;
