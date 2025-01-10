/**
 * Main component for rendering the list of companies.
 *
 * Displays a card for each company, provides an edit button, and includes a modal for adding/editing companies.
 * Also allows toggling between active and inactive companies, with feedback alerts for actions.
 */
import React, { useEffect, useState } from 'react';
import CompanyCard from '../../Cards/CompanyCard';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Grid, Switch } from '@mui/material';
import MDAlert from 'components/MDAlert';
import CompanyModal from '../../popup/CompanyPopUp';
import {
  fetchActiveCompanies,
  handleSave,
  handleToggleActiveInactive,
  handleCloseAlert,
} from './companyFuncs';
import { Alert, AlertDescription } from 'components/ui/alert';
const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isActive, setIsActive] = useState(true);
  const [noResultsMessage, setNoResultsMessage] = useState('');
  // Fetch companies on mount
  useEffect(() => {
    fetchActiveCompanies(setCompanies, setAlert, setNoResultsMessage);
  }, []);

  // Handle adding a new company
  const handleAddCompany = () => {
    setNoResultsMessage('');
    setSelectedCompany(null);
    setShowModal(true);
  };

  // Close modal and refresh companies
  const handleModalClose = () => {
    setNoResultsMessage('');
    setShowModal(false);
  };

  return (
    <div className="company-list">
      <Card id="company-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Entreprises
          </MDTypography>
          <MDButton onClick={handleAddCompany} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: 'bold' }}>add</Icon>&nbsp;Ajouter Entreprise
          </MDButton>
        </MDBox>
        <MDBox p={2}>
          <MDTypography variant="h6" fontWeight="medium">
            {isActive ? 'Active' : 'Inactive'}
          </MDTypography>
          <Switch
            checked={isActive}
            onChange={() =>
              handleToggleActiveInactive(
                isActive,
                setIsActive,
                setCompanies,
                setAlert,
                setNoResultsMessage
              )
            }
            style={{ marginRight: '10px' }}
          />
          <Grid container spacing={3}>
            {companies.map(company => (
              <Grid item xs={12} sm={8} md={4} key={company.id}>
                <CompanyCard
                  company={company}
                  onEdit={() => {
                    setSelectedCompany(company);
                    setShowModal(true);
                    setNoResultsMessage('');
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
        <CompanyModal
          company={selectedCompany}
          onSave={data =>
            handleSave(
              data,
              selectedCompany,
              setAlert,
              handleModalClose,
              setIsActive,
              isActive,
              setCompanies,
              setNoResultsMessage
            )
          }
          onClose={handleModalClose}
        />
      )}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={() => handleCloseAlert(setAlert, 10000)}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}
    </div>
  );
};
export default CompanyList;
