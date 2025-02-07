/**
 * SiteModal component
 *
 * This component renders a modal with a form to create or edit an entity.
 * It uses Material Design components for styling and layout.
 *
 * Props:
 * - site (object): The entity to edit, or null if creating a new entity.
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
import React, { useState, useEffect } from 'react';
import styles from '../largeStyles.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SiteService from 'services/Site_Services/siteService';
import { OPERATORS, priority, PROGRAMMES, STATUS_SITE_FK } from './constants';
const SiteModal = ({ site, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    site || {
      priorite_fk: { SP_desc: '' },
      status_site_fk: { SS_desc: '' },
      programme_fk: { PR_desc: '' },
      Acteur_ENEDIS_id: { nom: '' },
    }
  );
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [isActive, setIsActive] = useState(site ? site.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });*
    const { name, value } = e.target;
    // Special handling for nested fields
    if (name === 'priorite_fk') {
      setFormData({ ...formData, priorite_fk: { SP_desc: value } });
    } else if (name === 'programme_fk') {
      setFormData({ ...formData, programme_fk: { PR_desc: value } });
    } else if (name === 'status_site_fk') {
      setFormData({ ...formData, status_site_fk: { SS_desc: value } });
    } else if (name === 'Acteur_ENEDIS_id') {
      setFormData({ ...formData, Acteur_ENEDIS_id: { nom: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  useEffect(() => {
    if (site) {
      setFormData({
        ...site,
        priorite_fk: site.priorite_fk || { SP_desc: '' },
        status_site_fk: site.status_site_fk || { SS_desc: '' },
        programme_fk: site.programme_fk || { PR_desc: '' },
        Acteur_ENEDIS_id: site.Acteur_ENEDIS_id || { nom: '' },
      });
      setIsActive(site.is_active);
    }
  }, [site]);

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
  const handleSubmit = () => {
    const newErrors = {};

    // Ensure EB and G2R have values
    if (!formData.EB) newErrors.EB = true;
    if (!formData.G2R) newErrors.G2R = true;

    console.log('Validation errors:', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form data submitted:', formData);
    onSave({
      ...formData,
      Acteur_ENEDIS_id: formData.Acteur_ENEDIS_id.nom,
      is_active: isActive,
    });
  };
  const handleToggleActive = () => {
    if (site) {
      setIsActive(!isActive);
    }
  };
  const handleOperateursChange = e => {
    const { value } = e.target;
    setFormData({ ...formData, Operateurs: value });
  };
  const handleDropdownChange = (field, subField, value) => {
    setFormData({
      ...formData,
      [field]: { [subField]: value },
    });
  };
  const handleCompanieschange = (field, subField, value) => {
    if (field === 'Acteur_ENEDIS_id') {
      // Directly set the numeric ID instead of an object
      setFormData({
        ...formData,
        [field]: { ...formData[field], [subField]: value },
      });
    } else {
      setFormData({
        ...formData,
        [field]: { [subField]: value },
      });
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {site ? 'Modifier site' : 'Ajouter site'}
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            label="EB"
            name="EB"
            value={formData.EB || ''}
            onChange={handleChange}
            placeholder="EB*"
            style={{
              marginBottom: '1px',
              width: '320px',
              borderColor: errors.EB ? 'red' : '',
            }}
            required
            error={errors.EB}
          />
          <MDInput
            name="G2R"
            label="G2R"
            value={formData.G2R || ''}
            onChange={handleChange}
            placeholder="G2R*"
            style={{
              marginBottom: '1px',
              width: '320px',
              borderColor: errors.G2R ? 'red' : '',
            }}
            required
            error={errors.G2R}
          />
          <MDInput
            name="nom"
            label="Nom"
            value={formData.nom || ''}
            onChange={handleChange}
            placeholder="Nom*"
            style={{
              marginBottom: '1px',
              width: '320px',

              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />

          <FormControl
            fullWidth
            style={{ marginBottom: '1px', marginTop: '0px', width: '320px' }}
            required
          >
            <InputLabel id="devis-select-label">Prioirte</InputLabel>
            <Select
              name="priorite_fk"
              value={priority[formData.priorite_fk] || formData.priorite_fk.SP_desc || ''}
              onChange={e => handleDropdownChange('priorite_fk', 'SP_desc', e.target.value)}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.prenom ? 'red' : '',
              }}
              required
            >
              <MenuItem value="P00">P00</MenuItem>
              <MenuItem value="P0">P0</MenuItem>
              <MenuItem value="P1">P1</MenuItem>
              <MenuItem value="P2">P2</MenuItem>
            </Select>
          </FormControl>

          <MDInput
            label="Lot"
            name="lot"
            value={formData.lot || ''}
            onChange={handleChange}
            placeholder="LOT"
            style={{ marginBottom: '1px', width: '320px' }}
          ></MDInput>

          <MDInput
            label="Ville "
            name="Ville"
            value={formData.Ville || ''}
            onChange={handleChange}
            placeholder="Ville"
            style={{ marginBottom: '1px', width: '320px' }}
          ></MDInput>

          <MDInput
            label="Zone"
            name="zone"
            value={formData.zone || ''}
            onChange={handleChange}
            placeholder="Zone"
            style={{ marginBottom: '1px', width: '320px' }}
          ></MDInput>

          <FormControl
            fullWidth
            style={{ marginBottom: '1px', marginTop: '0px', width: '320px' }}
            required
          >
            <InputLabel id="devis-select-label">Region</InputLabel>
            <Select
              name="region"
              value={formData.region || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.prenom ? 'red' : '',
              }}
              required
            >
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
              <MenuItem value="Provence-Alpes-Côte d'Azur">
                Provence-Alpes-Côte d&apos;Azur
              </MenuItem>
              <MenuItem value="Réunion">Réunion</MenuItem>
            </Select>
          </FormControl>

          <MDInput
            name="code_postal"
            label="Code postal"
            value={formData.code_postal || ''}
            onChange={handleChange}
            placeholder="Code Postal"
            style={{ marginBottom: '1px', width: '320px' }}
          ></MDInput>

          <FormControl fullWidth style={{ marginBottom: '1px', marginTop: '0px', width: '320px' }}>
            <InputLabel id="devis-select-label">Operateurs</InputLabel>
            <Select
              labelId="operateurs-label"
              name="Operateurs"
              multiple
              value={formData.Operateurs || []}
              onChange={handleOperateursChange}
              renderValue={selected => selected.join(', ')}
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.prenom ? 'red' : '',
              }}
            >
              <InputLabel id="devis-select-label">Operateurs</InputLabel>
              {OPERATORS.map(operateur => (
                <MenuItem key={operateur} value={operateur}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        checked={formData.Operateurs && formData.Operateurs.includes(operateur)}
                        readOnly
                        style={{
                          marginRight: '10px',
                          transform: 'scale(1.2)',
                        }}
                      />
                      <MDTypography variant="body2">{operateur}</MDTypography>
                    </span>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            style={{ marginBottom: '1px', marginTop: '0px', width: '320px' }}
            required
          >
            <InputLabel id="devis-select-label">Programme</InputLabel>
            <Select
              name="programme_fk"
              value={PROGRAMMES[formData.programme_fk] || formData.programme_fk.PR_desc || ''}
              onChange={e => handleDropdownChange('programme_fk', 'PR_desc', e.target.value)}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.prenom ? 'red' : '',
              }}
              required
            >
              <MenuItem value="4GFixe">4GFixe</MenuItem>
              <MenuItem value="DCC">DCC</MenuItem>
              <MenuItem value="ARP">ARP</MenuItem>
              <MenuItem value="DENSIF_CZ_RED">DENSIF_CZ_RED</MenuItem>
              <MenuItem value="DENSIF_CZ">DENSIF_CZ</MenuItem>
              <MenuItem value="ZTD_RED">ZTD_RED</MenuItem>
              <MenuItem value="PAC-REMP">PAC-REMP</MenuItem>
              <MenuItem value="PAC">PAC</MenuItem>
              <MenuItem value="PAC-DUP">PAC-DUP</MenuItem>
              <MenuItem value="PAC-CONTINUITY-PLAN">PAC-CONTINUITY-PLAN</MenuItem>
              <MenuItem value="FM">FM</MenuItem>
              <MenuItem value="ORF">ORF</MenuItem>
              <MenuItem value="SFR TT ">SFR TT </MenuItem>
              <MenuItem value="FM TT ">FM TT </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            required
            style={{ marginBottom: '1px', marginTop: '0px', width: '320px' }}
          >
            <InputLabel id="devis-select-label">Acteur ENEDIS</InputLabel>
            <Select
              labelId="role-select-label"
              name="Acteur_ENEDIS_id"
              value={formData.Acteur_ENEDIS_id.nom || formData.Acteur_ENEDIS_id || ''}
              displayEmpty
              onChange={e => handleCompanieschange('Acteur_ENEDIS_id', 'nom', e.target.value)}
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.prenom ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir un acteur enedis --
              </MenuItem>
              {activeCompanies.length > 0 ? (
                activeCompanies.map(company => (
                  <MenuItem key={company.nom} value={company.ENTid}>
                    {company.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active companies available</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            style={{ marginBottom: '1px', marginTop: '0px', width: '320px' }}
            required
          >
            <InputLabel id="devis-select-label">Status site SFR</InputLabel>
            <Select
              name="status_site_SFR"
              value={formData.status_site_SFR || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.prenom ? 'red' : '',
              }}
              required
            >
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

          <FormControl
            fullWidth
            style={{ marginBottom: '1px', marginTop: '0px', width: '320px' }}
            required
          >
            <InputLabel id="devis-select-label">Status Site</InputLabel>
            <Select
              name="status_site_fk"
              value={
                STATUS_SITE_FK[formData.status_site_fk] || formData.status_site_fk.SS_desc || ''
              }
              onChange={e => handleDropdownChange('status_site_fk', 'SS_desc', e.target.value)}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.prenom ? 'red' : '',
              }}
              required
            >
              <MenuItem value="Activé">Activé</MenuItem>
              <MenuItem value="Inactif">Inactif</MenuItem>
              <MenuItem value="Terminé">Terminé</MenuItem>
            </Select>
          </FormControl>
          <div>
            <InputLabel>{isActive ? 'Active' : 'Inactive'}</InputLabel>
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
SiteModal.propTypes = {
  site: PropTypes.shape({
    EB: PropTypes.string,
    G2R: PropTypes.string,
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
    status_site_SFR: PropTypes.string,
    status_site_fk: PropTypes.shape({
      SS_desc: PropTypes.string.isRequired,
    }).isRequired,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default SiteModal;
