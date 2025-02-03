/**
 * A modal to edit a user's profile information.
 * @param {Object} userData The user object returned by the useAuth hook.
 * @param {Function} onSave A function that is called when the user clicks the save button.
 * @param {Function} onClose A function that is called when the user clicks the close button.
 * @returns A JSX element representing the modal.
 */
import React, { useState, useEffect } from 'react';
import styles from '../style.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Select, MenuItem, FormControl } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import SiteService from 'services/Site_Services/siteService';
const ProfileModal = ({ userData, onSave, onClose }) => {
  const [formData, setFormData] = useState(userData || {});
  const [isActive] = useState(userData ? userData.is_active : true);
  const [errors, setErrors] = useState({});
  const [activeCompanies, setActiveCompanies] = useState([]);
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchActiveCompanies = async () => {
      try {
        const result = await SiteService.getActiveCompanies();
        if (result.success) {
          setActiveCompanies(result.data);
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
  }, []);
  useEffect(() => {
    if (userData) {
      const selectedCompany = activeCompanies.find(
        company => company.nom === userData.entreprise // Match by company name
      );

      setFormData({
        ...userData,
        entreprise: selectedCompany ? selectedCompany.ENTid : '', // Use ENTid for the dropdown value
      });
    }
  }, [userData, activeCompanies]);

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = true;
    if (!formData.lastName) newErrors.lastName = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Map the selected company ID back to its name
    const selectedCompany = activeCompanies.find(company => company.ENTid === formData.entreprise);

    onSave({
      ...formData,
      entreprise: selectedCompany ? selectedCompany.nom : '', // Save the company name
      is_active: isActive,
    });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier profil
        </MDTypography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '320px' }}>
          <MDInput
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            placeholder="Prenom*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.firstName ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            placeholder="Nom*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.firstname ? 'red' : '',
            }}
            required
          />
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="genre"
              value={formData.genre || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.genre ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir genre --
              </MenuItem>
              <MenuItem value="Homme">Homme</MenuItem>
              <MenuItem value="Femme">Femme</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date de naissance"
              name="Date de naissance"
              value={formData.date_de_naissance ? dayjs(formData.date_de_naissance) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'date_de_naissance',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <FormControl fullWidth style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}>
            <Select
              name="entreprise"
              value={formData.entreprise || ''} // Use ENTid as the value
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.entreprise ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir une entreprise --
              </MenuItem>
              {activeCompanies.length > 0 ? (
                activeCompanies.map(company => (
                  <MenuItem key={company.ENTid} value={company.ENTid}>
                    {company.nom} {/* Display the company name */}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Pas des entreprises actives</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}>
            <Select
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.department ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le département--
              </MenuItem>
              <MenuItem value="RH">RH</MenuItem>
              <MenuItem value="Direction">Direction</MenuItem>
              <MenuItem value="Contrôle De Gestion">Contrôle De Gestion</MenuItem>
              <MenuItem value="Informatique">Informatique</MenuItem>
              <MenuItem value="Conception">Conception</MenuItem>
              <MenuItem value="Énergie">Énergie</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Étude Prix">Étude Prix</MenuItem>
            </Select>
          </FormControl>
        </div>
        <MDButton
          onClick={handleSubmit}
          variant="gradient"
          color="dark"
          style={{ marginLeft: '10px', marginTop: '10px' }}
        >
          Save
        </MDButton>
        <MDButton onClick={onClose} variant="gradient" color="dark" style={{ marginLeft: '170px' }}>
          Fermer
        </MDButton>
      </div>
    </div>
  );
};
ProfileModal.propTypes = {
  userData: PropTypes.shape({
    firstname: PropTypes.string,
    lastName: PropTypes.string,
    genre: PropTypes.string,
    date_de_naissance: PropTypes.string,
    entreprise: PropTypes.string,
    department: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ProfileModal;
