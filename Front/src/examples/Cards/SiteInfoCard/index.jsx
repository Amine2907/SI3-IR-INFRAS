import { React, useState, useEffect } from 'react';
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
  performSiteContactAction,
} from './SiteInfoData';
import { Select, MenuItem, FormControl } from '@mui/material';
import WarningPopUp from 'examples/popup/userPopUp/WariningPopUp';
import siteContactService from 'services/Site_Services/siteContactService';
import ContactSiteModal from 'examples/popup/ContactPopUp/ContactSitePopUp';
import ConatctStaticModal from 'examples/popup/ContactPopUp/ContactStaticPopUp';
import ProspectDpService from 'services/site_details/DP/DpService';
import SiteService from 'services/Site_Services/siteService';
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
      contact_fk: [],
    }
  );
  const [statusGoTraveauxR, setStatusGoTraveauxR] = useState('N/A');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [showContactModel, setShowContactModel] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactSite, setContactSite] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [contactToDeleteCid, setContactToDeleteCid] = useState(null);
  const [showDropDown, setShowDropDown] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const setSite = useState(null);
  // eslint-disable-next-line no-unused-vars
  const Sid = site.EB;
  const fetchSiteInfoDetails = async () => {
    try {
      const result = await SiteService.getSiteById(Sid);
      if (result.success) {
        console.log('Fetched site details:', result.data);
        setSite(result.data[0]);
      } else {
        console.error('Failed to fetch site details:', result.error);
      }
    } catch (error) {
      console.error('Error during fetch:', error.message);
    }
  };
  useEffect(() => {
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
  }, [Sid]);
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
  const handleContactsChange = event => {
    setFormData({
      ...formData,
      contact_fk: event.target.value,
    });
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

  useEffect(() => {
    const fetchDPStatus = async () => {
      try {
        const dpData = await ProspectDpService.getDpDataWithProspect(Sid);
        console.log('dpData:', dpData);
        if (dpData && dpData.data && dpData.data.length > 0) {
          const statusGoTraveauxR = dpData.data[0].status_go_traveauxR;
          setFormData(prev => ({
            ...prev,
            status_go_traveauxR: statusGoTraveauxR,
          }));
          await fetchSiteInfoDetails();
        }
      } catch (error) {
        console.error('Error fetching DP data:', error);
      }
    };
    fetchDPStatus();
  }, [Sid]);
  useEffect(() => {
    if (formData.status_go_traveauxR) {
      setStatusGoTraveauxR(formData.status_go_traveauxR);
    }
  }, [formData.status_go_traveauxR]);
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
  const handleToggleExpand = () => {
    setIsExpanded(prevState => !prevState);
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
    // Log to check values before making the API call
    console.log('Saving contact with data:', { Sid, contactData });
    try {
      const result = await siteContactService.addNewContactSite({ Sid, contactData });
      if (result.success) {
        setAlert({
          show: true,
          message: 'Contact saved successfully!',
          type: 'success',
        });
        await fetchContactsSite();
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
  // Close Alert
  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };
  // handle Open delete modal( PopUp Confirmation )
  const handleOpenDeleteModal = Cid => {
    setContactToDeleteCid(Cid); // Store the Cid
    setShowWarning(true); // Show the warning modal
  };
  // Handle Edit for display contact details
  const handleEdit = async contactId => {
    try {
      const response = await performSiteContactAction('fetchContacts', Sid);
      if (response.success) {
        const contacts = response.data;
        // Find the specific contact by Cid
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
  // Handle Delete Contact realted to a site
  const handleDelete = async Cid => {
    setShowWarning(false);
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
  // Handle Associate Contacts
  const handleAssociateContacts = async selectedContacts => {
    if (!selectedContacts || !Array.isArray(selectedContacts) || selectedContacts.length === 0) {
      setAlert({
        show: true,
        message: 'Please select at least one valid contact.',
        type: 'error',
      });
      return;
    }
    try {
      // Prepare the payload to send to the backend
      const payload = {
        Sid: Sid, // Site ID (string)
        Cids: selectedContacts, // Array of selected contact IDs
      };
      // console.log('Payload:', payload);
      // Send request to backend
      const response = await siteContactService.addExistingSiteContacts(payload); // Pass the payload as an object
      // Handle the server response
      if (response.success) {
        console.log('Contacts successfully associated:', response.data);
        setAlert({
          show: true,
          message: 'Contacts associated successfully!',
          type: 'success',
        });
        // Clear the selected contacts in the dropdown
        setFormData(prevFormData => ({
          ...prevFormData,
          contact_fk: [], // Reset the dropdown value
        }));
        // fetch conatcts realted to a site diretly after the addition
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
                      {Sid}
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
                {/* Status Traveaux GO R  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>construction</Icon> {/* Example Icon */}
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Status GO Traveaux (Reel):</strong>
                    {statusGoTraveauxR || 'N/A'}
                    {/* Display the value */}
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
                      style={{ marginBottom: '5px', marginTop: '2px', width: '190px' }}
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
                              <MenuItem key={contact.Cid} value={contact.Cid}>
                                {contact.nom ? contact.nom : contact.email}{' '}
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
                              {/* Contact Name */}
                              <span>
                                {contact.Contacts.nom ||
                                  contact.Contacts.email ||
                                  'Unknown Contact'}
                              </span>
                              {/* Action Icons */}
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
                {/* Edit Button */}
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Button variant="subtitle2" onClick={handleToggleExpand}>
                    {isExpanded ? "Moins d'informations" : "Plus d'informations"}
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
      {/* Add NEW CONTACT TO A SITE  */}
      {showModal && !showDropDown && (
        <ContactSiteModal
          Sid={Sid}
          contact={selectedContact}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}
      {/* Display Contact details */}
      {showContactModel && (
        <ConatctStaticModal contact={selectedContact} onClose={handleModalClose} />
      )}
      {/* WARNING POPUP */}
      {showWarning && (
        <WarningPopUp
          message="Are you sure you want to delete this contact?"
          onConfirm={() => handleDelete(contactToDeleteCid)}
          onCancel={handleModalClose}
        />
      )}
      {/* Alert */}
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
    statusGoTraveauxR: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default SiteInfoCard;
