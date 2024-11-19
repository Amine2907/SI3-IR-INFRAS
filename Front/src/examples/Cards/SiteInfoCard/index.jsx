import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import InputLabel from '@mui/material/InputLabel';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDAlert from 'components/MDAlert';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from '../../../context/index';
import {
  program,
  Status_Site,
  priority,
  fetchCompanyNameById,
  fetchContactNameById,
  getContactsSite,
  getAciveContacts,
} from './SiteInfoData';
import { Select, MenuItem, FormControl } from '@mui/material';
import contactService from 'services/contactsService';
import ContactModal from 'examples/popup/ContactPopUp/ContactPopUpl';
const SiteInfoCard = ({ site, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [companyName, setCompanyName] = useState('N/A');
  const [expanded, setExpanded] = useState(false); // State to control expansion
  // eslint-disable-next-line no-unused-vars
  const [contactName, setContactName] = useState('N/A');
  const [activeContacts, setActiveContacts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(
    site || {
      contact_fk: '',
    }
  );
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactSite, setContactSite] = useState([]);
  useEffect(() => {
    const Sid = site.EB;
    const fetchContactsSite = async () => {
      if (Sid) {
        try {
          const contactSite = await getContactsSite(Sid);
          console.log('Fetched contactSite:', contactSite);
          if (contactSite.contacts && Array.isArray(contactSite.contacts.data)) {
            setContactSite(contactSite.contacts.data);
          } else {
            setContactSite([]);
          }
        } catch (error) {
          console.error('Error fetching contacts:', error);
          setContactSite([]);
        }
      } else {
        setContactSite([]);
      }
    };

    fetchContactsSite();
  }, [site.EB]);
  useEffect(() => {
    const fetchActiveContacts = async () => {
      try {
        const fetchedContacts = await getAciveContacts();
        setActiveContacts(fetchedContacts);
      } catch (error) {
        console.error('Error fetching active contacts in useEffect:', error.message);
      }
    };
    fetchActiveContacts();
  }, []);
  // Function to fetch contact name
  useEffect(() => {
    const contactId = site.contact_fk;
    const fetchContactByName = async () => {
      if (contactId) {
        const name = await fetchContactNameById(contactId);
        setContactName(name);
      }
    };
    fetchContactByName();
  }, [site.contact_fk]);
  const handleContactsChange = e => {
    const value = e.target.value;
    setFormData({ ...formData, contact_fk: value });
  };
  // Function to fetch company name
  useEffect(() => {
    const acteurId = site.Acteur_ENEDIS_id;
    const fetchCompanyName = async () => {
      if (acteurId) {
        const name = await fetchCompanyNameById(acteurId);
        setCompanyName(name);
      }
    };
    fetchCompanyName();
  }, [site.Acteur_ENEDIS_id]);
  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  const handleAddContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false); // Hide modal
  };
  const handleSave = async data => {
    let result;
    let successMessage = '';
    try {
      result = await contactService.createContact(data);
      successMessage = 'Entité enregistrée avec succès !';
      // Check if result is not undefined and has a success property
      if (result && result.success) {
        console.log('Success:', result.success);
        setAlert({ show: true, message: successMessage, type: 'success' });
      } else {
        // If result is not successful, show an error alert
        console.error('Error:', result ? result.error : 'Unknown error');
        setAlert({
          show: true,
          message: `Error: ${result ? result.error : 'Unknown error'}`,
          type: 'error',
        });
      }
    } catch (error) {
      // If the asynchronous operation fails, handle the error
      console.error('Error during save operation:', error.message);
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    } finally {
      handleModalClose(); // Always close the modal, regardless of success or error
    }
  };
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  return (
    <Grid item xs={12}>
      <Card id="site_info_card">
        <MDBox p={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <MDBox
                borderRadius="lg"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-start"
                p={3}
                sx={{
                  border: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                }}
              >
                {/* EB and Programme */}
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  {/* EB */}
                  <MDBox display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>business</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      {site.EB}
                    </MDTypography>
                  </MDBox>
                  {/* Programme with Colored Background */}
                  <MDBox
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    sx={{
                      backgroundColor: '#89CFF0',
                      color: 'black',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MDTypography variant="h6" fontWeight="medium">
                      {program[site.programme_fk] || 'N/A'}
                    </MDTypography>
                  </MDBox>
                </MDBox>
                {/* G2R */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>map</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.G2R}
                  </MDTypography>
                </MDBox>
                {/* Name */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>label</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.nom}
                  </MDTypography>
                </MDBox>
                {/* Status Site SFR */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status SFR:</strong> {site.status_site_SFR}
                  </MDTypography>
                </MDBox>
                {/* Priorité */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>priority_high</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Priorité:</strong> {priority[site.priorite_fk] || 'N/A'}
                  </MDTypography>
                </MDBox>
                {/* LOT */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>folder</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Lot:</strong> {site.lot}
                  </MDTypography>
                </MDBox>
                {/* Zone */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>location_on</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Zone:</strong> {site.zone}
                  </MDTypography>
                </MDBox>
                {/* Ville */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>place</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Ville:</strong> {site.Ville}
                  </MDTypography>
                </MDBox>
                {/* Code_postal */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>mail</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.code_postal}
                  </MDTypography>
                </MDBox>
                {/* Region */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>public</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.region}
                  </MDTypography>
                </MDBox>
                {/* Acteur ENEDIS */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business_center</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {companyName}
                  </MDTypography>
                </MDBox>
                {/* Status Site */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status Site:</strong> {Status_Site[site.status_site_fk] || 'N/A'}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status:</strong> {site.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                {/* Collapsible Section for Extra Information */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <MDBox mt={2}>
                    <MDBox display="flex" alignItems="center">
                      <Icon sx={{ mr: 1 }}>person</Icon>
                      <MDTypography variant="subtitle2" color="textSecondary">
                        <strong>Contacts:</strong>{' '}
                      </MDTypography>
                    </MDBox>
                    <FormControl
                      fullWidth
                      style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
                    >
                      <InputLabel id="conatcts-label">Choisir un contact(s)</InputLabel>
                      <Select
                        labelId="conatcts-label"
                        name="contact_fk"
                        multiple
                        value={formData.contact_fk || []}
                        onChange={handleContactsChange}
                        renderValue={selected => selected.join(', ')}
                        style={{
                          padding: '10px',
                          fontSize: '14px',
                          borderColor: errors.prenom ? 'red' : '',
                        }}
                      >
                        <MenuItem value="" onClick={handleAddContact}>
                          -- Ajouter un nouveau contact --
                        </MenuItem>
                        <MenuItem value="" disabled>
                          -- Choisir un contact(s) existant(s)--
                        </MenuItem>
                        {activeContacts.length > 0 ? (
                          activeContacts.map(contact => (
                            <MenuItem key={contact.nom} value={contact.Cid}>
                              {contact.nom}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">No active contacts available</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    <MDTypography variant="subtitle2" color="textSecondary">
                      {contactSite && contactSite.length > 0 ? (
                        contactSite.map(contact => (
                          <MenuItem key={contact.Contacts.Cid} value={contact.Contacts.Cid}>
                            {contact.Contacts.nom || 'Unknown Contact'}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">No contacts related to this site</MenuItem>
                      )}
                    </MDTypography>
                  </MDBox>
                </Collapse>
                {/* Edit Button */}
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Button variant="subtitle2" onClick={handleToggleExpand}>
                    Plus d&apos;informations
                  </Button>
                  <Tooltip title="Edit site" placement="top">
                    <Icon sx={{ cursor: 'pointer' }} fontSize="small" onClick={onEdit}>
                      edit
                    </Icon>
                  </Tooltip>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      {showModal && (
        <ContactModal contact={selectedContact} onSave={handleSave} onClose={handleModalClose} />
      )}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={handleCloseAlert}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}
    </Grid>
  );
};
SiteInfoCard.propTypes = {
  site: PropTypes.shape({
    EB: PropTypes.string.isRequired,
    G2R: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    Ville: PropTypes.string.isRequired,
    lot: PropTypes.string.isRequired,
    zone: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    code_postal: PropTypes.string.isRequired,
    Acteur_ENEDIS_id: PropTypes.string.isRequired,
    priorite_fk: PropTypes.string.isRequired,
    status_site_fk: PropTypes.string.isRequired,
    programme_fk: PropTypes.string.isRequired,
    Operateurs: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
      .isRequired,
    contact_fk: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
      .isRequired,
    commentaires: PropTypes.string.isRequired,
    status_site_SFR: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default SiteInfoCard;
