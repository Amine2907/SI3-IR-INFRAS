import React, { useState } from 'react';
import styles from './ProfilePopUp.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Select, MenuItem, FormControl } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
const ProfileModal = ({ userData, onSave, onClose }) => {
  const [formData, setFormData] = useState(userData || {});
  const [isActive] = useState(userData ? userData.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = true;
    if (!formData.role) newErrors.role = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...formData, is_active: isActive });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier profil
        </MDTypography>
        <MDInput
          name="firstname"
          value={formData.firstname || ''}
          onChange={handleChange}
          placeholder="firstname*"
          style={{
            marginBottom: '5px',
            width: '320px',
            marginTop: '10px',
            borderColor: errors.firstname ? 'red' : '',
          }}
          required
        />
        <MDInput
          name="lastname"
          value={formData.lastname || ''}
          onChange={handleChange}
          placeholder="lastname*"
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
            name="role"
            value={formData.role || ''}
            onChange={handleChange}
            displayEmpty
            style={{
              padding: '10px',
              fontSize: '14px',
              borderColor: errors.prefirstname ? 'red' : '',
            }}
            required
          >
            <MenuItem value="" disabled>
              -- Select a Gender* --
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
                  name: 'Date de naissance',
                  value: newValue ? newValue.format('YYYY-MM-DD') : '',
                },
              });
            }}
            style={{ marginBottom: '10px', width: '320px' }}
          />
        </LocalizationProvider>
        <MDInput
          name="Entreprise"
          value={formData.entreprise || ''}
          onChange={handleChange}
          placeholder="Entreprise"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="Department"
          value={formData.department || ''}
          onChange={handleChange}
          placeholder="Department"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDButton
          onClick={handleSubmit}
          variant="gradient"
          color="dark"
          style={{ marginLeft: '10px', marginTop: '10px' }}
        >
          Save
        </MDButton>
        <MDButton onClick={onClose} variant="gradient" color="dark" style={{ marginLeft: '170px' }}>
          Close
        </MDButton>
      </div>
    </div>
  );
};
ProfileModal.propTypes = {
  userData: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    role: PropTypes.string,
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
