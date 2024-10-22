/**
 * EntiteCard Component
 *
 * This component renders a card displaying information about an entity.
 * It uses Material Dashboard 2 React components for styling and layout.
 *
 * Props:
 * - entite: An object containing the entity's information.
 *   - nom (string): The name of the entity (required).
 *   - role (string): The role of the entity (required).
 *   - adresse (string): The address of the entity (required).
 * - onEdit: A function to handle editing of the entity.
 *
 * The component retrieves the `darkMode` state from the Material UI controller context
 * to adjust styling based on the current theme mode.
 *
 * Dependencies:
 * - React
 * - PropTypes for prop type validation
 * - Material UI components: Grid, Tooltip, Icon, Card
 * - Material Dashboard 2 React components: MDBox, MDTypography
 * - useMaterialUIController for accessing the UI controller context
 */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from '../../../context/index';
import Card from '@mui/material/Card';
const EntiteCard = ({ entite, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (
    <Grid item xs={12}>
      <Card id="entite_card">
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
                {/* Name */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>person</Icon> {/* Full Name Icon */}
                  <MDTypography variant="h6" fontWeight="medium">
                    {entite.nom}
                  </MDTypography>
                </MDBox>
                {/* Role */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>email</Icon> {/* Email Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Role: {entite.role}
                  </MDTypography>
                </MDBox>
                {/* Adresse */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>home</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Adresse: {entite.adresse}
                  </MDTypography>
                </MDBox>
                {/* Ville */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>location_city</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Ville: {entite.ville}
                  </MDTypography>
                </MDBox>
                {/* Code Postal  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>markunread_mailbox</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Code Postal : {entite.code_postal}
                  </MDTypography>
                </MDBox>
                {/* Region */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>map</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Region: {entite.region}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Status: {entite.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                {/* Contact */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>work</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Personne de conatct : {entite.contact}
                  </MDTypography>
                </MDBox>
                {/* Email */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>email</Icon> {/* Email Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Email: {entite.email}
                  </MDTypography>
                </MDBox>
                {/* Phone */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>phone</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Tel: {entite.telephone}
                  </MDTypography>
                </MDBox>
                {/* Site web  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>language</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Site web: {entite.site_web}
                  </MDTypography>
                </MDBox>
                {/* IBAN  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>account_balance_wallet</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    IBAN: {entite.IBAN}
                  </MDTypography>
                </MDBox>
                {/* BIC */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>account_balance</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    BIC: {entite.BIC}
                  </MDTypography>
                </MDBox>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Tooltip title="Edit entite" placement="top">
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
EntiteCard.propTypes = {
  entite: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    adresse: PropTypes.string.isRequired,
    ville: PropTypes.string.isRequired,
    code_postal: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    contact: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    site_web: PropTypes.string.isRequired,
    IBAN: PropTypes.string.isRequired,
    BIC: PropTypes.string.isRequired,
    telephone: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default EntiteCard;
