/**
 * EntiteModal component
 *
 * This component renders a modal with a form to create or edit an entity.
 * It uses Material Design components for styling and layout.
 *
 * Props:
 * - entite (object): The entity to edit, or null if creating a new entity.
 * - onSave (function): Called when the form is submitted with valid data.
 *   - The function receives an object with the form data.
 * - onClose (function): Called when the modal is closed.
 *
 * The component manages its own state for the form data and errors.
 *
 * Dependencies:
 * - React
 * - PropTypes for prop type validation
 * - Material Design components: MDTypography, MDButton, MDInput, Switch, Select, MenuItem, FormControl
 */
import React, { useState } from 'react';
import styles from '../style.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
const EntiteModal = ({ entite, onSave, onClose }) => {
  const [formData, setFormData] = useState(entite || {});
  const [isActive, setIsActive] = useState(entite ? entite.is_active : true);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = true;
    if (!formData.role) newErrors.role = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
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
          {entite ? 'Modifier entite' : 'Ajouter entite'}
        </MDTypography>
        <MDInput
          name="nom"
          value={formData.nom || ''}
          onChange={handleChange}
          placeholder="Nom*"
          style={{
            marginBottom: '5px',
            width: '320px',
            marginTop: '10px',
            borderColor: errors.nom ? 'red' : '',
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
            style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
            required
          >
            <MenuItem value="" disabled>
              -- Choisir un Role* --
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
        <FormControl
          fullWidth
          style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
          required
        >
          <Select
            name="region"
            value={formData.region || ''}
            onChange={handleChange}
            displayEmpty
            style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
            required
          >
            <MenuItem value="" disabled>
              -- Choisir une Region* --
            </MenuItem>
            <MenuItem value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</MenuItem>
            <MenuItem value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</MenuItem>
            <MenuItem value="Bretagne">Bretagne</MenuItem>
            <MenuItem value="Centre-Val de Loire">Centre-Val de Loire</MenuItem>
            <MenuItem value="Corse">Corse</MenuItem>
            <MenuItem value="Grand Est">Grand Est</MenuItem>
            <MenuItem value="Guadeloupe">Guadeloupe</MenuItem>
            <MenuItem value="Guyane">Guyane</MenuItem>
            <MenuItem value="Hauts-de-France">Hauts-de-France</MenuItem>
            <MenuItem value="Île-de-France">Île-de-France</MenuItem>
            <MenuItem value="Martinique">Martinique</MenuItem>
            <MenuItem value="Normandie">Normandie</MenuItem>
            <MenuItem value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</MenuItem>
            <MenuItem value="Occitanie">Occitanie</MenuItem>
            <MenuItem value="Pays de la Loire">Pays de la Loire</MenuItem>
            <MenuItem value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d&apos;Azur</MenuItem>
            <MenuItem value="Réunion">Réunion</MenuItem>
          </Select>
        </FormControl>
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
          Fermer
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
