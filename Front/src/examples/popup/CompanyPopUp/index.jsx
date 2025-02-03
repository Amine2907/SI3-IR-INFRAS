import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from '@mui/material';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import styles from '../style.module.css';

// Department options for the multi-select
const DEPARTMENTS = [
  'Étude Prix',
  'RH',
  'Direction',
  'Contrôle De Gestion',
  'Informatique',
  'Conception',
  'Énergie',
  'Finance',
];

const CompanyModal = ({ company, onSave, onClose }) => {
  const [formData, setFormData] = useState(company || {});
  const [isActive, setIsActive] = useState(company ? company.is_active : true);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepartmentChange = event => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      department: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Le nom est requis.';
    if (!formData.siret) newErrors.siret = 'Le SIRET est requis.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({ ...formData, is_active: isActive });
  };

  const handleToggleActive = () => {
    setIsActive(prev => !prev);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {company ? 'Modifier Entreprise' : 'Ajouter Entreprise'}
        </MDTypography>

        <label className={styles.formLabel}>Nom d&apos;Entreprise</label>
        <MDInput
          name="nom"
          value={formData.nom || ''}
          onChange={handleChange}
          placeholder="Nom*"
          style={{
            marginBottom: '10px',
            width: '320px',
            borderColor: errors.nom ? 'red' : '',
          }}
        />
        {errors.nom && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nom}</span>}

        <label className={styles.formLabel}>Site Web</label>
        <MDInput
          name="site_web"
          value={formData.site_web || ''}
          onChange={handleChange}
          placeholder="Site Web"
          style={{ marginBottom: '10px', width: '320px' }}
        />

        <label className={styles.formLabel}>SIRET</label>
        <MDInput
          name="siret"
          value={formData.siret || ''}
          onChange={handleChange}
          placeholder="Siret*"
          style={{
            marginBottom: '10px',
            width: '320px',
            borderColor: errors.siret ? 'red' : '',
          }}
        />
        {errors.siret && <span style={{ color: 'red', fontSize: '12px' }}>{errors.siret}</span>}

        <label className={styles.formLabel}>Départements</label>
        <FormControl style={{ marginBottom: '10px', width: '320px' }}>
          <InputLabel id="department-label">Sélectionnez les départements</InputLabel>
          <Select
            labelId="department-label"
            multiple
            value={formData.department || []}
            onChange={handleDepartmentChange}
            renderValue={selected => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: '320px',
                },
              },
            }}
          >
            {DEPARTMENTS.map(dept => (
              <MenuItem key={dept} value={dept} style={{ padding: '8px 16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Checkbox
                    checked={formData.department?.includes(dept)}
                    style={{ marginRight: '8px' }}
                  />
                  <ListItemText primary={dept} style={{ textAlign: 'right', flex: 1 }} />
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div style={{ marginTop: '15px' }}>
          <InputLabel>Active</InputLabel>
          <Switch checked={isActive} onChange={handleToggleActive} />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <MDButton
            onClick={handleSubmit}
            variant="gradient"
            color="dark"
            style={{ marginRight: '10px' }}
          >
            Sauvegarder
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};

CompanyModal.propTypes = {
  company: PropTypes.shape({
    nom: PropTypes.string,
    site_web: PropTypes.string,
    siret: PropTypes.string,
    department: PropTypes.arrayOf(PropTypes.string),
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CompanyModal;
