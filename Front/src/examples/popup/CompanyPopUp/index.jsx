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
  const [formData, setFormData] = useState({
    nom: company?.nom || '',
    site_web: company?.site_web || '',
    siret: company?.siret || '',
    department: company?.department || [],
  });
  const [isActive, setIsActive] = useState(company?.is_active ?? true);
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
        <MDInput
          label="Nom d'Entreprise*"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom*"
          style={{
            marginBottom: '10px',
            marginTop: '10px',
            width: '320px',
            borderColor: errors.nom ? 'red' : '',
          }}
          error={errors.nom}
        />
        <MDInput
          name="site_web"
          label="Site web"
          value={formData.site_web}
          onChange={handleChange}
          placeholder="Site Web"
          style={{ marginBottom: '10px', width: '320px' }}
        />
        <MDInput
          name="siret"
          label="SIRET*"
          value={formData.siret}
          onChange={handleChange}
          placeholder="Siret*"
          style={{
            marginBottom: '10px',
            width: '320px',
            borderColor: errors.siret ? 'red' : '',
          }}
          error={errors.siret}
        />
        <FormControl style={{ marginBottom: '10px', width: '320px' }}>
          <InputLabel id="department-label">Sélectionnez les départements</InputLabel>
          <Select
            labelId="department-label"
            multiple
            value={formData.department}
            onChange={handleDepartmentChange}
            renderValue={selected => selected.join(', ')}
            style={{
              height: '40px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
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
              <MenuItem key={dept} value={dept}>
                <Checkbox checked={formData.department.includes(dept)} />
                <ListItemText primary={dept} />
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
