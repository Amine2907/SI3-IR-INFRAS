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
const SiteCard = ({ site, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [formData, setFormData] = useState(site);
  const [companyName, setCompanyName] = useState('N/A');
  const [isExpanded, setIsExpanded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [checkedValues, setCheckedValues] = useState({
    drPg: true,
    devisPg: true,
    mesPg: true,
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
        // Prospect Retenu
        console.log('Fetching Prospect Retenu...');
        const prospectResponse = await SiteFieldsService.getPropsectRetenu(Sid);
        console.log('Prospect Response:', prospectResponse);
        const retenu =
          Array.isArray(prospectResponse) && prospectResponse[0]?.retenu !== undefined
            ? prospectResponse[0].retenu
            : 'N/A';
        setFormData(prev => ({ ...prev, retenu }));

        // DR Date
        console.log('Fetching DR Date...');
        const drResponse = await SiteFieldsService.getDrDate(Sid);
        console.log('DR Date Response:', drResponse);
        const drDate = drResponse?.success ? drResponse.data : 'N/A';
        setFormData(prev => ({ ...prev, drDate }));

        // Devis Date
        console.log('Fetching Devis Date...');
        const devisResponse = await SiteFieldsService.getDevisDate(Sid);
        console.log('Devis Date Response:', devisResponse);
        const devisDate = devisResponse?.success ? devisResponse.data : 'N/A';
        setFormData(prev => ({ ...prev, devisDate }));

        // Reglement Date
        console.log('Fetching Reglement Date...');
        const reglementResponse = await SiteFieldsService.getReglementDate(Sid);
        console.log('Reglement Date Response:', reglementResponse);
        const reglementDate = reglementResponse?.success ? reglementResponse.data : 'N/A';
        setFormData(prev => ({ ...prev, reglementDate }));

        // MES Date
        console.log('Fetching MES Date...');
        const mesResponse = await SiteFieldsService.getMesDate(Sid);
        console.log('MES Date Response:', mesResponse);
        const mesDate = mesResponse?.success ? mesResponse.data : 'N/A';
        setFormData(prev => ({ ...prev, mesDate }));
      } catch (error) {
        console.error('Error fetching site fields data:', error);
      }
    };

    fetchData();
  }, [Sid]);

  useEffect(() => {
    // Update Prospect Retenu
    if (formData.prospectRetenu) {
      setProspectRetenu(formData.prospectRetenu);
    }

    // Update DR Date
    if (formData.drDate) {
      setDrDate(formData.drDate);
    }

    // Update Devis Date
    if (formData.devisDate) {
      setDevisDate(formData.devisDate);
    }

    // Update Règlement Date
    if (formData.reglementDate) {
      setReglementDate(formData.reglementDate);
    }

    // Update MES Date
    if (formData.mesDate) {
      setMesDate(formData.mesDate);
    }
  }, [
    formData.prospectRetenu,
    formData.drDate,
    formData.devisDate,
    formData.reglementDate,
    formData.mesDate,
  ]);
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
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status:</strong> {site.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                {/* Checkbox Options */}
                <MDBox display="flex" alignItems="center">
                  <Checkbox
                    checked={checkedValues.drPg}
                    onChange={handleCheckboxChange}
                    name="drPg"
                  />
                  <MDTypography variant="h6" fontWeight="medium">
                    DR PG
                  </MDTypography>
                  <Checkbox
                    checked={checkedValues.devisPg}
                    onChange={handleCheckboxChange}
                    name="devisPg"
                  />
                  <MDTypography variant="h6" fontWeight="medium">
                    DEVIS PG
                  </MDTypography>
                  <Checkbox
                    checked={checkedValues.mesPg}
                    onChange={handleCheckboxChange}
                    name="mesPg"
                  />
                  <MDTypography variant="h6" fontWeight="medium">
                    MES PG
                  </MDTypography>
                </MDBox>
                {/* Collapsible Section for Extra Information */}
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <MDBox display="flex" alignItems="center" mt={2}>
                    <Icon sx={{ mr: 1 }}>person</Icon>
                    <MDTypography variant="h6" fontWeight="medium">
                      <strong>Prospect Retenu:</strong> {formData.retenu || 'N/A'}
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
