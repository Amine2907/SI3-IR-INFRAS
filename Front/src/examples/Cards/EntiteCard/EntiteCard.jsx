// Description :
// Le composant EntiteCard permet d'afficher une carte contenant des informations détaillées sur une entité (par exemple, une entreprise ou un individu). Cette carte présente plusieurs détails, tels que le nom, le rôle, l'adresse, le statut actif, les contacts, les informations de localisation, ainsi que les informations financières (IBAN et BIC). Ce composant utilise des éléments de la bibliothèque Material UI pour la mise en page et le style.

// Props :
// entite (objet, requis): Un objet contenant les informations de l'entité. Il doit contenir les propriétés suivantes :

// nom (string): Le nom de l'entité.
// role (string): Le rôle de l'entité.
// adresse (string): L'adresse de l'entité.
// ville (string): La ville de l'entité.
// code_postal (string): Le code postal de l'entité.
// region (string): La région où se situe l'entité.
// contact (string): Le nom de la personne de contact au sein de l'entité.
// email (string): L'email de l'entité.
// telephone (string): Le numéro de téléphone de l'entité.
// site_web (string): L'URL du site web de l'entité.
// IBAN (string): L'IBAN de l'entité.
// BIC (string): Le code BIC de l'entité.
// is_active (booléen): Le statut d'activité de l'entité, où true signifie actif et false inactif.
// onEdit (fonction, requis): Une fonction qui sera exécutée lorsque l'utilisateur cliquera sur l'icône d'édition, permettant de gérer l'édition de l'entité.

// Dépendances :
// React : Utilisé pour la création du composant fonctionnel.
// PropTypes : Utilisé pour valider les types des props.
// Material UI : Utilisé pour les composants visuels comme Grid, Tooltip, Icon, Card, etc.
// Material Dashboard 2 React : Utilisation des composants MDBox et MDTypography pour améliorer le rendu et l'ergonomie.
// useMaterialUIController : Permet d'accéder à l'état darkMode du contexte de l'interface utilisateur, afin d'adapter le style en fonction du mode sombre ou clair.
// Fonctionnalité :
// Affichage des informations de l'entité :

// Le nom de l'entité est affiché avec une icône de personne.
// Le rôle de l'entité est affiché avec une icône de mail.
// L'adresse, la ville, le code postal et la région sont affichés avec des icônes respectives pour chaque champ.
// Le statut d'activité de l'entité est affiché avec une icône de statut (actif ou inactif).
// Les informations de contact, email, téléphone, site web, IBAN et BIC sont également affichées avec des icônes correspondantes.
// Édition de l'entité :

// Le composant inclut une icône d'édition qui, lorsqu'elle est cliquée, appelle la fonction onEdit pour permettre la modification des informations de l'entité.
// Mode sombre/clair :

// Le style du composant s'ajuste dynamiquement au mode actuel (sombre ou clair), contrôlé par l'état darkMode provenant du contexte useMaterialUIController.
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
                    <strong>Role:</strong>
                    {entite.role}
                  </MDTypography>
                </MDBox>
                {/* Adresse */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>home</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Adresse:</strong>
                    {entite.adresse}
                  </MDTypography>
                </MDBox>
                {/* Ville */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>location_city</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Ville:</strong> {entite.ville}
                  </MDTypography>
                </MDBox>
                {/* Code Postal  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>markunread_mailbox</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Code Postal:</strong>
                    {entite.code_postal}
                  </MDTypography>
                </MDBox>
                {/* Region */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>map</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Region:</strong>
                    {entite.region}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status:</strong>
                    {entite.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                {/* Contact */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>work</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Personne de conatct :</strong>
                    {entite.contact}
                  </MDTypography>
                </MDBox>
                {/* Email */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>email</Icon> {/* Email Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Email:</strong>
                    {entite.email}
                  </MDTypography>
                </MDBox>
                {/* Phone */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>phone</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Tel:</strong>
                    {entite.telephone}
                  </MDTypography>
                </MDBox>
                {/* Site web  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>language</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Site web:</strong>
                    {entite.site_web}
                  </MDTypography>
                </MDBox>
                {/* IBAN  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>account_balance_wallet</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>IBAN:</strong>
                    {entite.IBAN}
                  </MDTypography>
                </MDBox>
                {/* BIC */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>account_balance</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>BIC:</strong>
                    {entite.BIC}
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
