/**
 * EntiteList component
 *
 * This component renders a list of entities with search and filter capabilities.
 * Users can toggle between active and inactive entities, search by multiple criteria,
 * and add or edit entities via a modal form.
 *
 * State Variables:
 * - entites: Array of entities to be displayed.
 * - showModal: Boolean indicating whether the entity modal is visible.
 * - selectedEntity: The currently selected entity for editing, or null for adding a new entity.
 * - alert: Object containing alert visibility, message, and type.
 * - isActive: Boolean indicating whether active entities are displayed.
 * - setSearchTerm: Object containing search fields for filtering entities.
 * - noResultsMessage: Message displayed when no entities match the search criteria.
 *
 * Functions:
 * - renderSearch: Filters entities based on the search query.
 * - fetchActiveEntites: Fetches and updates the list of active entities.
 * - fetchInactiveEntites: Fetches and updates the list of inactive entities.
 * - handleAddEntite: Opens the modal for adding a new entity.
 * - handleModalClose: Closes the modal and refreshes the entity list.
 * - handleSave: Saves a new or edited entity and updates the list.
 * - handleCloseAlert: Closes the alert notification.
 * - handleRoleChange: Updates search query based on role selection.
 * - handleSearchChange: Updates search query and fetches entities based on input.
 * - handleSearchEntities: Fetches entities matching the search query.
 * - handleToggleActiveInactive: Toggles between displaying active and inactive entities.
 *
 * The component uses Material Dashboard 2 React components and Material UI for styling.
 */
import React, { useEffect, useState } from 'react';
import entityService from 'services/Entites/entityService';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const renderSearch = () => {
    if (searchTerm.trim().length > 0) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filteredEntites = entites.filter(entite => {
        return (
          (entite.nom && entite.nom.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (entite.ville && entite.ville.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (entite.region && entite.region.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (entite.code_postal && entite.code_postal.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (entite.role && entite.role.toLowerCase().includes(lowerCaseSearchTerm))
        );
      });

      return filteredEntites; // Return filtered entities
    }
    return entites; // Return original entities if no search term
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
      if (result.data.length === 0) {
        setNoResultsMessage('Aucune entité active trouvée.');
      }
    } else {
      console.error(result.error);
      setNoResultsMessage(
        'Erreur lors de la récupération des entités. Veuillez réessayer plus tard.'
      );
    }
  };
  const fetchInactiveEntites = async () => {
    const result = await entityService.getInactiveEntites();
    if (result.success) {
      setEntites(result.data);
      if (result.data.length === 0) {
        setNoResultsMessage('Aucune entité inactive trouvée.');
      } // Update your entites state here
    } else {
      console.error(result.error);
      setNoResultsMessage(
        'Erreur lors de la récupération des entités. Veuillez réessayer plus tard.'
      );
    }
  };
  // Function to handle adding entities
  const handleAddEntite = () => {
    setSelectedEntity(null); // Clear selected entity for new entry
    setShowModal(true); // Show modal for adding a new entity
    fetchActiveEntites(); // Refresh entity list after adding/editing
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
      result = await entityService.updateEntity(selectedEntity.Eid, data);
      successMessage = 'Entité mise à jour avec succès !';
    } else {
      // Create new entity
      result = await entityService.createEntity(data);
      successMessage = 'Entité enregistrée avec succès !';
    }
    // Handle the result with alert feedback
    if (result.success) {
      setAlert({ show: true, message: successMessage, type: 'success' });
      fetchActiveEntites();
    } else {
      setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
      fetchActiveEntites();
    }
    handleModalClose();
    if (isActive) {
      fetchActiveEntites(); // Fetch active entities
    } else {
      fetchInactiveEntites(); // Fetch inactive entities
    }
    fetchActiveEntites();
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
    setSearchTerm(prev => ({ ...prev, [name]: value }));
  };
  // Search functionality
  const handleSearchChange = e => {
    const value = e.target.value; // Get the input value
    setSearchTerm(value); // Update search term state
    if (value.trim() === '') {
      fetchActiveEntites(); // Fetch all entities if search bar is cleared
    }
  };
  const handleSearchEntities = async () => {
    try {
      if (!setSearchTerm || typeof setSearchTerm !== 'object') {
        console.error('Invalid setSearchTerm: setSearchTerm must be an object');
        return;
      }
      const result = await entityService.searchEntities(setSearchTerm);
      if (result.success) {
        setEntites(result.data);
        // Show message if no contacts are found
        if (result.data.length === 0) {
          setNoResultsMessage('Aucune entité trouvée pour les critères de recherche spécifiés.');
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
      setNoResultsMessage(''); // clear the no results message
      return newIsActive; // Update the state
    });
  };
  useEffect(() => {
    console.log('Updated setSearchTerm:', setSearchTerm); // Ensure `setSearchTerm` is updated
    if (
      setSearchTerm.nom ||
      setSearchTerm.ville ||
      setSearchTerm.region ||
      setSearchTerm.code_postal ||
      setSearchTerm.role
    ) {
      handleSearchEntities();
    } else {
      fetchActiveEntites(); // Clear filters if all fields are empty
    }
  }, [setSearchTerm]);
  // Render filtered entities
  const filteredEntites = renderSearch();
  return (
    <div className="entite-list">
      <Card id="search-entite">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox pr={1}>
            <div className="entite-list">
              {/* Search Bar */}
              <MDInput
                label="Recherche par nom, ville, region, code postal"
                name="searchTerm"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              {/* Dropdown for Role Selection */}
              <FormControl variant="outlined" style={{ marginBottom: '10px', marginRight: '10px' }}>
                <MDTypography variant="body2" fontWeight="medium">
                  Role
                </MDTypography>
                <Select
                  labelId="role-select-label"
                  name="role"
                  value={setSearchTerm.role}
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
                  setSearchTerm({ nom: '', ville: '', region: '', code_postal: '', role: '' });
                }}
                variant="gradient"
                color="dark"
              >
                Effacer la recherche
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
            <Alert variant="destructive" className="mt-4">
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
