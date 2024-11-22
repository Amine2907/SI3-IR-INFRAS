import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { DeleteIcon, EditIcon, CirclePlus } from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import MDBox from 'components/MDBox';
import MDAlert from 'components/MDAlert';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from '../../../context/index';
import {
  program,
  Status_Site,
  priority,
  fetchCompanyNameById,
  getContactsSite,
  getAciveContacts,
  performSiteContactAction,
} from './SiteInfoData';
import { Select, MenuItem, FormControl } from '@mui/material';
import WarningPopUp from 'examples/popup/userPopUp/WariningPopUp';
import siteContactService from 'services/Site_Services/siteContactService';
import ContactSiteModal from 'examples/popup/ContactPopUp/ContactSitePopUp';
import ConatctStaticModal from 'examples/popup/ContactPopUp/ContactStaticPopUp';

const SiteInfoCard = ({ site, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [companyName, setCompanyName] = useState('N/A');
  const [expanded, setExpanded] = useState(false);
  const [activeContacts, setActiveContacts] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(
    site || {
      contact_fk: [],
    }
  );
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [showContactModel, setShowContactModel] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactSite, setContactSite] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [contactToDeleteCid, setContactToDeleteCid] = useState(null);
  const [showDropDown, setShowDropDown] = useState(true);

  useEffect(() => {
    const Sid = site.EB;
    const fetchContactsSite = async () => {
      if (Sid) {
        try {
          const contactSite = await getContactsSite(Sid);
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

  const isValidProgramDescription = description => {
    const validDescriptions = [
      '4GFixe',
      'DCC',
      'ARP',
      'DENSIF_CZ_RED',
      'DENSIF_CZ',
      'ZTD_RED',
      'PAC-REMP',
      'PAC',
      'PAC-DUP',
      'PAC-CONTINUITY-PLAN',
      'FM',
      'ORF',
      'SFR TT',
      'FM TT',
    ];
    return validDescriptions.includes(description);
  };

  // eslint-disable-next-line no-unused-vars
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'programme_fk') {
      if (!isValidProgramDescription(value)) {
        setErrors(prev => ({ ...prev, programme_fk: 'Invalid program description' }));
        return;
      }
      setErrors(prev => ({ ...prev, programme_fk: null }));
    }
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleNestedChange = (field, subField, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: { ...prevData[field], [subField]: value },
    }));
  };

  const handleContactsChange = event => {
    setFormData({
      ...formData,
      contact_fk: event.target.value,
    });
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAddContact = () => {
    setSelectedContact();
    setShowModal(true);
    setShowDropDown(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowContactModel(false);
    setShowWarning(false);
    setSelectedContact(null);
    setShowDropDown(true);
  };

  const handleSave = async data => {
    const { contactData } = data;
    const Sid = site.EB;
    console.log('Saving contact with data:', { Sid, contactData });
    try {
      const result = await siteContactService.updateSite({
        Sid,
        ...site,
        ...contactData,
      });
      if (result.success) {
        setAlert({
          show: true,
          message: 'Site updated successfully!',
          type: 'success',
        });
        // Refresh site data here if necessary
      } else {
        console.error('Error response:', result);
        setAlert({
          show: true,
          message: `Error: ${result.error || 'Unknown error'}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error during save operation:', error);
      setAlert({
        show: true,
        message: `Error: ${error.message}`,
        type: 'error',
      });
    } finally {
      handleModalClose();
    }
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };

  const handleOpenDeleteModal = Cid => {
    setContactToDeleteCid(Cid);
    setShowWarning(true);
  };

  const handleEdit = async contactId => {
    try {
      const Sid = site.EB;
      const response = await performSiteContactAction('fetchContacts', Sid);
      if (response.success) {
        const contacts = response.data;
        const contact = contacts.find(c => c.Cid === contactId)?.Contact;
        console.log('Extracted contact:', contact);
        if (contact) {
          setSelectedContact(contact);
          setShowContactModel(true);
        } else {
          setAlert({
            show: true,
            type: 'error',
            message: 'No contact found for the given ID.',
          });
        }
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: response.error || 'Failed to fetch contacts for this site.',
        });
      }
    } catch (error) {
      console.error('Error in handleEdit:', error.message);
      setAlert({
        show: true,
        type: 'error',
        message: 'An error occurred while fetching the contacts.',
      });
    }
  };

  const handleDelete = async Cid => {
    setShowWarning(false);
    const Sid = site.EB;
    if (!Cid) {
      setAlert({ show: true, message: 'Contact ID is required', type: 'error' });
      return;
    }
    try {
      const response = await performSiteContactAction('deleteContact', Sid, { Cid });
      if (response.success) {
        setContactSite(prevContacts =>
          prevContacts.filter(contact => contact.Contacts.Cid !== Cid)
        );
        setAlert({ show: true, message: 'Contact deleted successfully!', type: 'success' });
      } else {
        console.error('Error:', response.error || 'Unknown error');
        setAlert({
          show: true,
          message: response.error || 'An error occurred during deletion.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error in handleDelete:', error.message);
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    }
  };

  const handleAssociateContacts = async selectedContacts => {
    const siteId = site.EB;
    if (!selectedContacts || !Array.isArray(selectedContacts) || selectedContacts.length === 0) {
      setAlert({
        show: true,
        message: 'Please select at least one valid contact.',
        type: 'error',
      });
      return;
    }
    try {
      const payload = {
        Sid: siteId,
        Cids: selectedContacts,
      };
      const response = await siteContactService.addExistingSiteContacts(payload);
      if (response.success) {
        console.log('Contacts successfully associated:', response.data);
        setAlert({
          show: true,
          message: 'Contacts associated successfully!',
          type: 'success',
        });
        selectedContacts = [];
        const fetchContactsSite = async () => {
          if (siteId) {
            try {
              const contactSite = await getContactsSite(siteId);
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
        await fetchContactsSite();
      } else {
        console.error('Error associating contacts:', response.error);
        setAlert({
          show: true,
          message: `Failed to associate contacts: ${response.error}`,
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error associating contacts:', error);
      setAlert({
        show: true,
        message: 'Failed to associate contacts.',
        type: 'error',
      });
    }
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
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  <MDBox display="flex" alignItems="center">
                    <Icon sx={{ mr: 1 }}>business</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      {site.EB}
                    </MDTypography>
                  </MDBox>
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
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>map</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.G2R}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>label</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.nom}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status SFR:</strong> {site.status_site_SFR}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>priority_high</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Priorité:</strong> {priority[site.priorite_fk] || 'N/A'}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>folder</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Lot:</strong> {site.lot}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>location_on</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Zone:</strong> {site.zone}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>place</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Ville:</strong> {site.Ville}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>mail</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.code_postal}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>public</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.region}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business_center</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {companyName}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status Site:</strong> {Status_Site[site.status_site_fk] || 'N/A'}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status:</strong> {site.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
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
                      <MenuItem value="">
                        Choisir un contact(s)
                        <IconButton
                          onClick={() => handleAssociateContacts(formData.contact_fk)}
                          aria-label="Edit Contact"
                          style={{
                            marginLeft: '8px',
                          }}
                        >
                          <CirclePlus />
                        </IconButton>
                      </MenuItem>
                      {showDropDown && (
                        <Select
                          labelId="contacts-label"
                          name="contact_fk"
                          multiple
                          value={formData.contact_fk || []}
                          onChange={handleContactsChange}
                          renderValue={selected =>
                            activeContacts
                              .filter(contact => selected.includes(contact.Cid))
                              .map(contact => contact.nom)
                              .join(', ')
                          }
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
                      )}
                    </FormControl>
                    <MDTypography variant="subtitle2" color="textSecondary">
                      {contactSite && contactSite.length > 0 ? (
                        contactSite.map(contact => (
                          <MenuItem key={contact.Contacts.Cid} value={contact.Contacts.Cid}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              width="100%"
                            >
                              <span>{contact.Contacts.nom || 'Unknown Contact'}</span>
                              <Box>
                                <IconButton
                                  onClick={() => handleEdit(contact?.Contacts?.Cid)}
                                  aria-label="Edit Contact"
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleOpenDeleteModal(contact?.Contacts?.Cid)}
                                  aria-label="Delete Contact"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MDTypography variant="subtitle2" color="textSecondary">
                          No contacts related to this site
                        </MDTypography>
                      )}
                    </MDTypography>
                  </MDBox>
                </Collapse>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Button variant="subtitle2" onClick={handleToggleExpand}>
                    Plus d&apos;informations
                  </Button>
                  <Tooltip title="Modifier site" placement="top">
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
      {showModal && !showDropDown && (
        <ContactSiteModal
          Sid={site.EB}
          contact={selectedContact}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}
      {showContactModel && (
        <ConatctStaticModal contact={selectedContact} onClose={handleModalClose} />
      )}
      {showWarning && (
        <WarningPopUp
          message="Are you sure you want to delete this contact?"
          onConfirm={() => handleDelete(contactToDeleteCid)}
          onCancel={handleModalClose}
        />
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
