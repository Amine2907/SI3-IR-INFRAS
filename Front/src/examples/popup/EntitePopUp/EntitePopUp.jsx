import React, { useState } from 'react';
import styles from './EntitePopUp.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
const EntiteModal = ({ entite, onSave, onClose }) => {
  const [formData, setFormData] = useState(entite || {});
  const [isActive, setIsActive] = useState(entite ? entite.is_active : true);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...formData, is_active: isActive });
  };
  const handleToggleActive = () => {
    if (entite) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {entite ? 'Edit entite' : 'Add entite'}
        </MDTypography>
        <MDInput
          name="nom"
          value={formData.nom || ''}
          onChange={handleChange}
          placeholder="Nom"
          style={{ marginBottom: '5px', width: '320px', marginTop: '10px' }}
        ></MDInput>
        <FormControl fullWidth style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}>
          <Select
            name="role"
            value={formData.role || ''}
            onChange={handleChange}
            displayEmpty
            style={{ padding: '10px', fontSize: '14px' }}
          >
            <MenuItem value="" disabled>
              -- Select a Role --
            </MenuItem>
            <MenuItem value="Fournisseur">Fournisseur</MenuItem>
            <MenuItem value="CSPS">CSPS</MenuItem>
            <MenuItem value="Syndicat">Syndicat</MenuItem>
            <MenuItem value="Pyloniste">Pyloniste</MenuItem>
            <MenuItem value="Génie Civiliste">Génie Civiliste</MenuItem>
            <MenuItem value="Géotechnicien">Géotechnicien</MenuItem>
            <MenuItem value="Dronist">Dronist</MenuItem>
            <MenuItem value="Mairie">Mairie</MenuItem>
          </Select>
        </FormControl>
        <MDInput
          name="adresse"
          value={formData.adresse || ''}
          onChange={handleChange}
          placeholder="Adresse"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="ville"
          value={formData.ville || ''}
          onChange={handleChange}
          placeholder="Ville"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="code_postal"
          value={formData.code_postal || ''}
          onChange={handleChange}
          placeholder="Code Postal"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="region"
          value={formData.region || ''}
          onChange={handleChange}
          placeholder="Region"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="contact"
          value={formData.contact || ''}
          onChange={handleChange}
          placeholder="Conatct"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="telephone"
          value={formData.telephone || ''}
          onChange={handleChange}
          placeholder="Telephone"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="site_web"
          value={formData.site_web || ''}
          onChange={handleChange}
          placeholder="Site Web"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="IBAN"
          value={formData.IBAN || ''}
          onChange={handleChange}
          placeholder="IBAN"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="BIC"
          value={formData.BIC || ''}
          onChange={handleChange}
          placeholder="BIC"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <div>
          <label>{isActive ? 'Active' : 'Inactive'}</label>
          <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
            {' '}
            {isActive ? 'Active' : 'Inactive'}
          </Switch>
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
          Close
        </MDButton>
      </div>
    </div>
  );
};
EntiteModal.propTypes = {
  entite: PropTypes.shape({
    nom: PropTypes.string,
    role: PropTypes.string,
    adresse: PropTypes.string,
    ville: PropTypes.string,
    code_postal: PropTypes.string,
    region: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string,
    site_web: PropTypes.string,
    IBAN: PropTypes.string,
    BIC: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default EntiteModal;
