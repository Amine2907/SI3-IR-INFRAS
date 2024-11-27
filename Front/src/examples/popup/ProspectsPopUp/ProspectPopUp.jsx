import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
const ProspectModal = ({ prospect, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    prospect || {
      status_validation_fk: { SV_desc: '' },
    }
  );
  const [isActive, setIsActive] = useState(prospect ? prospect.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });*
    const { name, value } = e.target;
    // Special handling for nested fields
    if (name === 'status_validations_fk') {
      setFormData({ ...formData, status_validations_fk: { SV_desc: value } });
    }
  };
  useEffect(() => {
    if (prospect) {
      setFormData({
        ...prospect,
        status_validations_fk: prospect.status_validations_fk || { SV_desc: '' },
      });
      setIsActive(prospect.is_active);
    }
  }, [prospect]);
  const handleSubmit = () => {
    const newErrors = {};
    console.log('Validation errors:', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log('Form data submitted:', formData);
    onSave({
      ...formData,
      is_active: isActive,
    });
  };
  const handleToggleActive = () => {
    if (prospect) {
      setIsActive(!isActive);
    }
  };
  const handleDropdownChange = (field, subField, value) => {
    setFormData({
      ...formData,
      [field]: { [subField]: value },
    });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {prospect ? 'Modifier prospect' : 'Ajouter prospect'}
        </MDTypography>
        <div className={styles.formGrid}>
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
          <MDInput
            name="section"
            value={formData.section || ''}
            onChange={handleChange}
            placeholder="Section*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="parcelle"
            value={formData.parcelle || ''}
            onChange={handleChange}
            placeholder="Parcelle*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            placeholder="longitude*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            placeholder="latitude*"
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
              name="status_validation_fk"
              value={formData.status_validation_fk.SV_desc || ''}
              onChange={e =>
                handleDropdownChange('status_validation_fk', 'SV_desc', e.target.value)
              }
              displayEmpty
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le status validations --
              </MenuItem>
              <MenuItem value="P00">P00</MenuItem>
              <MenuItem value="P0">P0</MenuItem>
              <MenuItem value="P1">P1</MenuItem>
              <MenuItem value="P2">P2</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="status_site_sfr"
              value={formData.status_site_sfr || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                --Choisir le status de site SFR--
              </MenuItem>
              <MenuItem value="0.Bloquée/Suspendu MAD">0.Bloquée/Suspendu MAD</MenuItem>
              <MenuItem value="0.Bloquée/Suspendu Conv">0.Bloquée/Suspendu Conv</MenuItem>
              <MenuItem value="0.Bloquée/Suspendu DP">0.Bloquée/Suspendu DP</MenuItem>
              <MenuItem value="1.En Recherche">1.En Recherche</MenuItem>
              <MenuItem value="2.En validation">2.En validation</MenuItem>
              <MenuItem value="3.Validé">3.Validé</MenuItem>
              <MenuItem value="3.En Conception">3.En Conception</MenuItem>
              <MenuItem value="4.En cours conception">4.En cours conception</MenuItem>
              <MenuItem value="4.GO Constr. Anticipé">4.GO Constr. Anticipé</MenuItem>
              <MenuItem value="5.En attente visées FH">5.En attente visées FH</MenuItem>
              <MenuItem value="5.GO Constructibilité">5.GO Constructibilité</MenuItem>
              <MenuItem value="6.GO Constructibilité">6.GO Constructibilité</MenuItem>
              <MenuItem value="7.GO Constructibilité Anticipé">
                7.GO Constructibilité Anticipé
              </MenuItem>
              <MenuItem value="7.MES">7.MES</MenuItem>
              <MenuItem value="8.Annulé">8.Annulé</MenuItem>
              <MenuItem value="8.PEM">8.PEM</MenuItem>
              <MenuItem value="En service">En service</MenuItem>
            </Select>
          </FormControl>
          <div>
            <label>{isActive ? 'Active' : 'Inactive'}</label>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            Save
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
ProspectModal.propTypes = {
  prospect: PropTypes.shape({
    nom: PropTypes.string,
    section: PropTypes.string,
    nom: PropTypes.string,
    lot: PropTypes.string,
    Ville: PropTypes.string,
    zone: PropTypes.string,
    region: PropTypes.string,
    code_postal: PropTypes.string,
    priorite_fk: PropTypes.shape({
      SP_desc: PropTypes.string.isRequired,
    }).isRequired,
    Operateurs: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
      .isRequired,
    programme_fk: PropTypes.shape({
      PR_desc: PropTypes.string.isRequired,
    }).isRequired,
    Acteur_ENEDIS_id: PropTypes.shape({
      nom: PropTypes.string.isRequired,
    }).isRequired,
    status_prospect_SFR: PropTypes.string,
    status_prospect_fk: PropTypes.shape({
      SS_desc: PropTypes.string.isRequired,
    }).isRequired,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ProspectModal;
