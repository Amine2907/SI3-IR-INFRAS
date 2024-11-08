// Description :
// Le composant SiteCard permet d'afficher une carte contenant des informations détaillées sur une entité (par exemple, une entreprise ou un individu). Cette carte présente plusieurs détails, tels que le nom, le rôle, l'adresse, le statut actif, les contacts, les informations de localisation, ainsi que les informations financières (IBAN et BIC). Ce composant utilise des éléments de la bibliothèque Material UI pour la mise en page et le style.

// Props :
// site (objet, requis): Un objet contenant les informations de l'entité. Il doit contenir les propriétés suivantes :

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
const SiteCard = ({ site, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
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
                {/* Ville */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>location_city</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.Ville}
                  </MDTypography>
                </MDBox>
                {/* lot */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>place</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.lot}
                  </MDTypography>
                </MDBox>
                {/* zone */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>area_chart</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.zone}
                  </MDTypography>
                </MDBox>
                {/* region */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>public</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.region}
                  </MDTypography>
                </MDBox>
                {/* code postal */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>mail</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.code_postal}
                  </MDTypography>
                </MDBox>
                {/* Acteur ENEDIS */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>business_center</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    {site.Acteur_ENEDIS_id}
                  </MDTypography>
                </MDBox>
                {/* priorite_fk */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>priority_high</Icon>
                  <MDTypography variant="h6" fontWeight="medium">
                    <strong>Priorite:</strong>
                    {site.priorite_fk}
                  </MDTypography>
                </MDBox>
                {/* Operateurs */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>engineering</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Operateurs:</strong>{' '}
                    {Array.isArray(site.Operateurs) ? site.Operateurs.join(', ') : site.Operateurs}
                  </MDTypography>
                </MDBox>
                {/* Status Site  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status Site :</strong>
                    {site.status_site_fk}
                  </MDTypography>
                </MDBox>
                {/* Status Site SFR  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>signal_cellular_alt</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status SFR:</strong>
                    {site.status_site_SFR}
                  </MDTypography>
                </MDBox>
                {/* Programme  */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>assignment</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Programme :</strong>
                    {site.programme_fk}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Status:</strong>
                    {site.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                {/* Commentaires */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>comment</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Commentaires:</strong>
                    {site.commentaires}
                  </MDTypography>
                </MDBox>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
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
    Operateurs: PropTypes.string.isRequired,
    programme_fk: PropTypes.string.isRequired,
    commentaires: PropTypes.string.isRequired,
    status_site_SFR: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default SiteCard;
