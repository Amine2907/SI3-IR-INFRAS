// Description :
// Le composant ContactCard rend une carte affichant les informations d'un contact. Cette carte utilise des composants de Material UI pour le style et la mise en page. Elle permet de visualiser les informations de base sur un contact, telles que son nom, son rôle, son email, son téléphone, et son état actif/inactif. Elle inclut également un bouton d'édition pour chaque contact.

// Props :
// contact (objet, requis): Un objet contenant les informations du contact à afficher. Il doit contenir les propriétés suivantes :

// nom (string): Le prénom du contact.
// prenom (string): Le nom de famille du contact.
// email (string): L'email du contact.
// tel (string): Le numéro de téléphone fixe du contact.
// mobile (string): Le numéro de téléphone mobile du contact.
// mission (string): La mission ou fonction du contact.
// is_active (booléen): L'état d'activité du contact, où true signifie actif et false inactif.
// onEdit (fonction, requis): Une fonction qui sera exécutée lorsque l'utilisateur clique sur l'icône d'édition. Cette fonction est responsable de gérer l'ouverture d'un formulaire d'édition pour le contact.

// Dépendances :
// React : Pour la création du composant fonctionnel.
// PropTypes : Utilisé pour la validation des types des props.
// Material UI : Utilisé pour les composants visuels comme Grid, Tooltip, Icon, Card, etc.
// Material Dashboard 2 React : Utilisation des composants MDBox et MDTypography pour un meilleur rendu et style.
// useMaterialUIController : Utilisé pour récupérer l'état darkMode du contexte UI de Material UI, afin d'ajuster le style selon le mode (clair ou sombre).
// Fonctionnalité :
// Affichage des informations de contact :

// Le nom complet du contact (prénom et nom) est affiché avec une icône de personne.
// L'email du contact est affiché avec une icône d'email.
// Le rôle ou la mission du contact est affiché avec une icône de travail.
// Les numéros de téléphone fixe et mobile sont affichés avec des icônes de téléphone.
// L'état du contact (actif/inactif) est affiché avec une icône de statut.
// Édition du contact :

// Le composant inclut une icône d'édition qui, lorsqu'elle est cliquée, déclenche la fonction onEdit, permettant à l'utilisateur d'éditer les informations du contact.
// Mode sombre/claire :

// Le style de l'interface est adapté selon le mode actuel (sombre ou clair), ce qui est contrôlé par le contexte useMaterialUIController.
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
const ContactCard = ({ contact, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (
    <Grid item xs={12}>
      <Card id="contact_card">
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
                {/* Full Name */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>person</Icon> {/* Full Name Icon */}
                  <MDTypography variant="h6" fontWeight="medium">
                    {contact.nom}&nbsp;
                    {contact.prenom}
                  </MDTypography>
                </MDBox>
                {/* Email */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>email</Icon> {/* Email Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Email:</strong> {contact.email}
                  </MDTypography>
                </MDBox>
                {/* Position */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>work</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Position:</strong>
                    {contact.mission}
                  </MDTypography>
                </MDBox>
                {/* Phone */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>phone</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Tel:</strong>
                    {contact.tel}
                  </MDTypography>
                </MDBox>
                {/* Mobile */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>phone_iphone</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Mobile:</strong>
                    {contact.mobile}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status:</strong> {contact.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Tooltip title="Edit Contact" placement="top">
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
ContactCard.propTypes = {
  contact: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    tel: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    mission: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default ContactCard;
