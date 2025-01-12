// Description :
// Le composant CompanyCard affiche une carte contenant des informations sur une entreprise. Il utilise des composants de Material UI pour la mise en page et le style. Ce composant permet de visualiser les informations essentielles d'une entreprise telles que son nom, son site web, son numéro SIRET, ses départements et son état actif/inactif. Il inclut également une icône d'édition pour permettre la modification des informations de l'entreprise.

// Props :
// company (objet, requis): Un objet contenant les informations de l'entreprise à afficher. Il doit contenir les propriétés suivantes :

// nom (string): Le nom de l'entreprise.
// site_web (string): L'URL du site web de l'entreprise.
// department (string ou tableau de strings): Les départements auxquels appartient l'entreprise. Si plusieurs départements, ils sont affichés sous forme de liste séparée par des virgules.
// siret (string): Le numéro SIRET de l'entreprise.
// is_active (booléen): L'état d'activité de l'entreprise, où true signifie actif et false inactif.
// onEdit (fonction, requis): Une fonction qui est exécutée lorsque l'utilisateur clique sur l'icône d'édition. Elle permet de gérer l'ouverture du formulaire d'édition pour l'entreprise.

// Dépendances :
// React : Utilisé pour la création du composant fonctionnel.
// PropTypes : Utilisé pour valider les types des props.
// Material UI : Utilisé pour les composants visuels comme Grid, Tooltip, Icon, Card, etc.
// Material Dashboard 2 React : Utilisation des composants MDBox et MDTypography pour un meilleur rendu et style.
// useMaterialUIController : Permet d'accéder à l'état darkMode du contexte de l'interface utilisateur, afin d'ajuster le style en fonction du mode clair ou sombre.
// Fonctionnalité :
// Affichage des informations de l'entreprise :

// Le nom de l'entreprise est affiché avec une icône de bureau.
// Le site web de l'entreprise est affiché avec une icône de globe.
// Le numéro SIRET de l'entreprise est affiché avec une icône de société.
// Les départements de l'entreprise sont affichés avec une icône d'appartement. Si plusieurs départements existent, ils sont affichés séparément par des virgules.
// L'état de l'entreprise (actif/inactif) est affiché avec une icône de statut.
// Édition de l'entreprise :

// Le composant inclut une icône d'édition qui, lorsqu'elle est cliquée, exécute la fonction onEdit, permettant ainsi d'éditer les informations de l'entreprise.
// Mode sombre/clair :

// Le style de l'interface s'adapte au mode actuel (sombre ou clair), contrôlé par l'état darkMode du contexte useMaterialUIController.
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
const CompanyCard = ({ company, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (
    <Grid item xs={12}>
      <Card id="company_card">
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
                  <Icon sx={{ mr: 1 }}>business</Icon> {/* Full Name Icon */}
                  <MDTypography variant="h6" fontWeight="medium">
                    {company.nom}
                  </MDTypography>
                </MDBox>
                {/* Site Web */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>language</Icon> {/* Website Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Site Web:</strong> {company.site_web}
                  </MDTypography>
                </MDBox>
                {/* SIRET */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>corporate_fare</Icon> {/* Siret Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>SIRET:</strong> {company.siret}
                  </MDTypography>
                </MDBox>
                {/* Départements */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>apartment</Icon> {/* Department Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    <strong>Départements:</strong>{' '}
                    {Array.isArray(company.department)
                      ? company.department.join(', ')
                      : company.department}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Status: {company.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Tooltip title="Edit company" placement="top">
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
CompanyCard.propTypes = {
  company: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    site_web: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    siret: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default CompanyCard;
