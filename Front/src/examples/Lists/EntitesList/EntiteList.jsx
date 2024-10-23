/**
 * This component renders a list of entities.
 *
 * It fetches the list of entities from the backend when it mounts.
 * It renders a card for each entity, with a button to edit the entity.
 * It also renders a button to add a new entity, and a modal to edit or add an entity.
 *
 * The modal is used to edit or add an entity. It contains a form with the entity's name, email, and phone.
 * When the form is submitted, it sends the data to the backend and then fetches the new list of entities.
 *
 * If there is an error, it renders an alert with the error message.
 */
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

  useEffect(() => {
    fetchActiveEntites();
  }, []);

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

  // Fetch Active and Inactive entities
  const fetchActiveEntites = async () => {
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

  // Search functionality
  const handleSearchChange = e => {
    const { name, value } = e.target;
    setSearchQuery(prev => ({ ...prev, [name]: value }));
    if (value === '') {
      fetchActiveEntites(); // If search input is cleared, fetch active entities
    } else {
      handleSearchEntities(); // If there's input, fetch filtered entities
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
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error searching for entities:', error);
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

  // Render filtered entities
  const filteredEntites = renderSearch();

  return (
    <div className="entite-list">
      <Card id="delete-account">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Entités
          </MDTypography>
          <MDBox pr={1}>
            <div className="entite-list">
              <MDInput
                label="Search"
                name="nom"
                value={searchQuery.nom}
                onChange={handleSearchChange}
                style={{ marginBottom: '10px', marginRight: '10px' }}
              />
              <MDButton
                onClick={() => {
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
