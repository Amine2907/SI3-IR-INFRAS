import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl, Input } from '@mui/material';
const DpModal = ({ dp, onSave, onClose }) => {
  const [formData, setFormData] = useState(dp || {});
  const [isActive, setIsActive] = useState(dp ? dp.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (dp) {
      setFormData({
        ...dp,
      });
      setIsActive(dp.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [dp]);
  //   const validateForm = () => {
  //     const newErrors = {};
  //     if (!formData.nom) newErrors.nom = true;
  //     if (!formData.latitude) newErrors.latitude = true;
  //     return newErrors;
  //   };
  const handleSubmit = () => {
    const newErrors = {};
    // if (!formData.nom) newErrors.nom = true;
    // if (!formData.prenom) newErrors.prenom = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...formData, is_active: isActive });
  };
  const handleToggleActive = () => {
    if (dp) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Ajouter dp
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="ANO_certificat_tacite"
            value={formData.ANO_certificat_tacite || ''}
            onChange={handleChange}
            placeholder="ANO_certificat_tacite*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="arrete_opposition"
            value={formData.arrete_opposition || ''}
            onChange={handleChange}
            placeholder="arrete_opposition*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="derniere_verification"
            value={formData.derniere_verification || ''}
            onChange={handleChange}
            placeholder="derniere_verification*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="etat_prerequis"
            value={formData.etat_prerequis || ''}
            onChange={handleChange}
            placeholder="etat_prerequis*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="MJS"
            value={formData.MJS || ''}
            onChange={handleChange}
            placeholder="MJS*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="numero_DP"
            value={formData.numero_DP || ''}
            onChange={handleChange}
            placeholder="numero_DP"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.cout_estime ? 'red' : '',
            }}
            required
          />
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="plans"
              value={formData.plans || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.plans ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le status du plan --
              </MenuItem>
              <MenuItem>OK</MenuItem>
              <MenuItem>NOK</MenuItem>
            </Select>
          </FormControl>
          <MDInput
            name="production_DP_PC"
            value={formData.production_DP_PC || ''}
            onChange={handleChange}
            placeholder="production_DP_PC"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.production_DP_PC ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="recipisse_depot_DP"
            value={formData.recipisse_depot_DP || ''}
            onChange={handleChange}
            placeholder="recipisse_depot_DP"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.recipisse_depot_DP ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="status_go_traveauxP"
            value={formData.status_go_traveauxP || ''}
            onChange={handleChange}
            placeholder="status_go_traveauxP"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.status_go_traveauxP ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="status_go_traveauxR"
            value={formData.status_go_traveauxR || ''}
            onChange={handleChange}
            placeholder="status_go_traveauxR"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.status_go_traveauxR ? 'red' : '',
            }}
            required
          />
          <div>
            <label>{isActive ? 'Active' : 'Inactive'}</label>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
            <MDTypography>Relance</MDTypography>
            <Input
              type="checkbox"
              checked={formData.relance}
              readOnly
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            enregistrer
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
DpModal.propTypes = {
  dp: PropTypes.shape({
    ANO_certificat_tacite: PropTypes.string,
    arrete_opposition: PropTypes.string,
    derniere_verification: PropTypes.string,
    etat_prerequis: PropTypes.string,
    MJS: PropTypes.string,
    numero_DP: PropTypes.string,
    plans: PropTypes.string,
    production_DP_PC: PropTypes.string,
    recipisse_depot_DP: PropTypes.string,
    status_go_traveauxP: PropTypes.string,
    status_go_traveauxR: PropTypes.string,
    relance: PropTypes.bool,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default DpModal;
