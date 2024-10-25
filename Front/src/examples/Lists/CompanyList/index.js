/**
 * This component renders a list of companies.
 *
 * It fetches the list of companies from the backend when it mounts.
 * It renders a card for each company, with a button to edit the company.
 * It also renders a button to add a new company, and a modal to edit or add a company.
 *
 * The modal is used to edit or add a company. It contains a form with the company's name, email, and phone.
 * When the form is submitted, it sends the data to the backend and then fetches the new list of companies.
 *
 * If there is an error, it renders an alert with the error message.
 */
import React, { useEffect, useState } from 'react';
import CompanyCard from '../../Cards/CompanyCard';
// @mui material components
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Grid, Switch } from '@mui/material';
import MDAlert from 'components/MDAlert';
// import ContactModal from 'examples/popup/ContactPopUp/ContactPopUpl';
import CompanyService from 'services/CompanyService';
import CompanyModal from '../../popup/CompanyPopUp';

const companyList = () => {
  const [companies, setcompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedcompany, setselectedcompany] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    fetchActivecompanies();
  }, []);
  const handleAddcompany = () => {
    setselectedcompany(null); // Clear selected company for new entry
    setShowModal(true); // Show modal for adding a new company
  };
  const handleModalClose = () => {
    setShowModal(false); // Hide modal
    fetchActivecompanies(); // Refresh company list after adding/editing
  };
  const handleSave = async data => {
    let result;
    let successMessage = '';
    if (selectedcompany) {
      // Update company
      console.log('Updating company:', selectedcompany.id);
      result = await CompanyService.updateCompany(selectedcompany.ENTid, data);
      successMessage = 'company updated successfully!';
    } else {
      // Create new company
      result = await CompanyService.createCompany(data);
      successMessage = 'company saved successfully!';
    }
    // Handle the result with alert feedback
    if (result.success) {
      setAlert({ show: true, message: successMessage, type: 'success' });
    } else {
      setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
    }
    handleModalClose();
    if (isActive) {
      fetchActivecompanies(); // If isActive is true, fetch active entities
    } else {
      fetchInactivecompanies(); // If isActive is false, fetch inactive entities
    }
    setIsActive(true); // Set the switch state to Active after modifying an entity
  };
  // Function to close the alert
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  ///////////////////////////////////////////////////////////////////////// TOGGLE ACTIVE / Inactive
  const fetchActivecompanies = async () => {
    const result = await CompanyService.getActiveCompanys();
    if (result.success) {
      setcompanies(result.data); // Update your companies state here
    } else {
      console.error(result.error);
    }
  };
  const fetchInactivecompanies = async () => {
    const result = await CompanyService.getInactiveCompanys();
    if (result.success) {
      setcompanies(result.data); // Update your companies state here
    } else {
      console.error(result.error);
    }
  };
  // GetActive and Inactive companies
  const handleToggleActiveInactive = async () => {
    setIsActive(prevIsActive => {
      const newIsActive = !prevIsActive; // Toggle the active state
      // Fetch companies based on the new state
      if (newIsActive) {
        fetchActivecompanies();
      } else {
        fetchInactivecompanies();
      }
      return newIsActive; // Update the state
    });
  };
  ////////////////////////////////////////////////////////////////////////
  return (
    <div className="company-list">
      <Card id="company-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            companies
          </MDTypography>
          <MDButton onClick={handleAddcompany} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
            &nbsp;Ajouter company
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
          >
            {' '}
            {isActive ? 'Active' : 'Inactive'}
          </Switch>
          <Grid container spacing={3}>
            {companies.map(company => (
              <Grid item xs={12} sm={8} md={4} key={company.id}>
                <CompanyCard
                  company={company}
                  onEdit={() => {
                    setselectedcompany(company); // Set selected company
                    setShowModal(true); // Show modal for editing
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </Card>
      {showModal && (
        <CompanyModal company={selectedcompany} onSave={handleSave} onClose={handleModalClose} />
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
export default companyList;
