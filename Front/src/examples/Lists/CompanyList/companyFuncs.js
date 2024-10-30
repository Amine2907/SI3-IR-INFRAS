/**
 * Functions for handling companies list, saving, fetching, and toggling active/inactive status.
 */
import CompanyService from 'services/CompanyService';

// Fetch active companies
export const fetchActiveCompanies = async (setCompanies, setAlert) => {
  const result = await CompanyService.getActiveCompanys();
  if (result.success) {
    setCompanies(result.data);
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
  }
};
// Fetch inactive companies
export const fetchInactiveCompanies = async (setCompanies, setAlert) => {
  const result = await CompanyService.getInactiveCompanys();
  if (result.success) {
    setCompanies(result.data);
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
  }
};

// Toggle between active and inactive companies
export const handleToggleActiveInactive = (isActive, setIsActive, setCompanies, setAlert) => {
  setIsActive(!isActive);
  if (!isActive) {
    fetchActiveCompanies(setCompanies, setAlert);
  } else {
    fetchInactiveCompanies(setCompanies, setAlert);
  }
};

// Handle save function for adding or editing a company
export const handleSave = async (
  data,
  selectedCompany,
  setAlert,
  handleModalClose,
  setIsActive,
  isActive,
  setCompanies
) => {
  let result;
  const successMessage = selectedCompany
    ? 'Company updated successfully!'
    : 'Company saved successfully!';

  if (selectedCompany) {
    result = await CompanyService.updateCompany(selectedCompany.ENTid, data);
  } else {
    result = await CompanyService.createCompany(data);
  }

  if (result.success) {
    setAlert({ show: true, message: successMessage, type: 'success' });
  } else {
    setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
  }

  handleModalClose();
  if (isActive) {
    fetchActiveCompanies(setCompanies, setAlert);
  } else {
    fetchInactiveCompanies(setCompanies, setAlert);
  }
  setIsActive(true); // Reset to active after modification
};

// Close alert function
export const handleCloseAlert = setAlert => {
  setAlert({ show: false, message: '', type: '' });
};
