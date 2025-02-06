/* eslint-disable */
import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from '../../../context/index';
import { program, Status_Site, priority, fetchCompanyNameById } from './CardData';
import SiteFieldsService from 'services/Site_Services/siteFieldsService';
import checkFilesService from 'services/site_details/DynFields/checkFilesService';
const SiteCard = ({ site, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [formData, setFormData] = useState(site);
  const [companyName, setCompanyName] = useState('N/A');
  const [isExpanded, setIsExpanded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hasFiles, setHasFiles] = useState({
    dr: false,
    devis: false,
    mes: false,
  });
  // State to hold data fetched from SiteFieldsService
  const [prospectRetenu, setProspectRetenu] = useState('N/A');
  const [drDate, setDrDate] = useState(null);
  const [devisDate, setDevisDate] = useState(null);
  const [reglementDate, setReglementDate] = useState(null);
  const [mesDate, setMesDate] = useState(null);
  const Sid = site.EB;
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
    setIsExpanded(prevState => !prevState);
    setExpanded(!expanded);
  };

  const handleCheckboxChange = event => {
    const { name, checked } = event.target;
    setCheckedValues(prev => ({ ...prev, [name]: checked }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prospectResponse = await SiteFieldsService.getPropsectRetenu(Sid);
        const drResponse = await SiteFieldsService.getDrDate(Sid);
        const devisResponse = await SiteFieldsService.getDevisDate(Sid);
        const reglementResponse = await SiteFieldsService.getReglementDate(Sid);
        const mesResponse = await SiteFieldsService.getMesDate(Sid);

        console.log('Responses:', {
          prospectResponse,
          drResponse,
          devisResponse,
          reglementResponse,
          mesResponse,
        });

        setFormData({
          retenu: prospectResponse?.retenu || false,
          drDate: drResponse?.drDate || 'N/A',
          devisDate: devisResponse?.devisDate || 'N/A',
          reglementDate: reglementResponse?.reglementDate || 'N/A',
          mesDate: mesResponse?.mesDate || 'N/A',
        });
      } catch (error) {
        console.error('Error fetching site fields data:', error);
      }
    };
    if (Sid) {
      fetchData();
    }
  }, [Sid]);
  useEffect(() => {
    setProspectRetenu(formData.retenu || 'N/A');
    setDrDate(formData.drDate || 'N/A');
    setDevisDate(formData.devisDate || 'N/A');
    setReglementDate(formData.reglementDate || 'N/A');
    setMesDate(formData.mesDate || 'N/A');
  }, [formData]);
  //
  useEffect(() => {
    const fetchFileStatus = async () => {
      if (!Sid) {
        console.warn('Sid is not provided. Cannot fetch file statuses.');
        return; // Exit if Sid is undefined or null
      }
      try {
        const fileStatuses = await checkFilesService.checkAllFilesStatus(Sid);
        console.log('File Statuses:', fileStatuses); // Debug the response
        setHasFiles(fileStatuses); // Update state with the result
      } catch (error) {
        console.error('Error fetching file statuses:', error);
      }
    };

    fetchFileStatus(); // Call the function
  }, [Sid]); // Dependency array ensures this runs when Sid changes
  return (
    <Grid item xs={12}>
      <Card id="site_card">
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
                {/* EB */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.EB}
                  </MDTypography>
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
                {/* Adresse */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>location_city</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.Ville}, {site.code_postal}, {site.region}
                  </MDTypography>
                </MDBox>
                {/* Acteur ENEDIS */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business_center</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {companyName}
                  </MDTypography>
                </MDBox>
                {/* Priorité */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>priority_high</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Priorité:</strong> {priority[site.priorite_fk] || 'N/A'}
                  </MDTypography>
                </MDBox>
                {/* Status Site */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status Site:</strong> {Status_Site[site.status_site_fk] || 'N/A'}
                  </MDTypography>
                </MDBox>
                {/* Status Site SFR */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status SFR:</strong> {site.status_site_SFR}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" flexDirection="row" flexWrap="wrap" mt={2} gap={2}>
                  {hasFiles && Object.entries(hasFiles).length > 0 ? (
                    Object.entries(hasFiles).map(([key, value]) => (
                      <MDBox display="flex" alignItems="center" key={key} mr={2}>
                        <Checkbox checked={value} disabled />
                        <MDTypography variant="h6" fontWeight="medium">
                          {key.toUpperCase()}
                        </MDTypography>
                      </MDBox>
                    ))
                  ) : (
                    <MDTypography variant="h6" fontWeight="medium">
                      No File Statuses Found or Loading...
                    </MDTypography>
                  )}
                </MDBox>
                {/* Collapsible Section for Extra Information */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <Icon sx={{ mr: 1 }}>person</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      <strong>Prospect Retenu:</strong> {formData.retenu ? 'Oui' : 'Non'}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <Icon sx={{ mr: 1 }}>calendar_today</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      <strong>DR Date:</strong> {formData.drDate || 'N/A'}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <Icon sx={{ mr: 1 }}>calendar_today</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      <strong>Devis Date:</strong> {formData.devisDate || 'N/A'}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <Icon sx={{ mr: 1 }}>calendar_today</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      <strong>Règlement Date:</strong> {formData.reglementDate || 'N/A'}
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <Icon sx={{ mr: 1 }}>calendar_today</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      <strong>MES Date:</strong> {formData.mesDate || 'N/A'}
                    </MDTypography>
                  </MDBox>
                </Collapse>
                {/* Edit Button */}
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Button variant="subtitle2" onClick={handleToggleExpand}>
                    {isExpanded ? "Moins d'informations" : "Plus d'informations"}
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
    </Grid>
  );
};
SiteCard.propTypes = {
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
    commentaires: PropTypes.string.isRequired,
    status_site_SFR: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
    prospectRetenu: PropTypes.string.isRequired,
    drDate: PropTypes.string.isRequired,
    devisDate: PropTypes.string.isRequired,
    reglementDate: PropTypes.string.isRequired,
    mesDate: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default SiteCard;
