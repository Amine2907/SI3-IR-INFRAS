import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import dashboardService from 'services/Dashboard/dashService';
import dashFilesService from 'services/Dashboard/dashFilesService';
import DashboardCharts from './Charts';
function Dashboard() {
  const [data, setData] = useState({
    drProduit: 0,
    devisRecu: 0,
    devisEnAttente: 0,
    devisValidationOperateur: 0,
    devisSigne: 0,
    reglementOk: 0,
    reglementEnAttente: 0,
    planificationExtension: 0,
    extensionOk: 0,
    planificationBranchement: 0,
    branchementOk: 0,
    consuelRecu: 0,
    demandeMESRealisee: 0,
    consuelEnAttente: 0,
    demandeMESEnAttente: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          drProduit,
          devisRecu,
          devisEnAttente,
          devisValidationOperateur,
          devisSigne,
          reglementOk,
          reglementEnAttente,
          planificationExtension,
          extensionOk,
          planificationBranchement,
          branchementOk,
          consuelRecu,
          demandeMESRealisee,
          consuelEnAttente,
          demandeMESEnAttente,
        ] = await Promise.all([
          dashboardService.countDr(),
          dashboardService.countDevisRecu(),
          dashboardService.countDevisEnAttente(),
          dashboardService.countDevisValidationOpérateur(),
          dashboardService.countDevisSigne(),
          dashboardService.countReglementOk(),
          dashboardService.countReglementEnAttente(),
          dashboardService.countPlanificationExtension(),
          dashboardService.countExtensionOk(),
          dashboardService.countPlanificationBranchements(),
          dashboardService.countBranchementOk(),
          dashboardService.countConsuelRecu(),
          dashboardService.countDemandeMESRealisee(),
          dashboardService.countConsuelEnAttente(),
          dashboardService.countDemandeMESEnAttente(),
        ]);
        setData({
          drProduit: drProduit.data,
          devisRecu: devisRecu.data,
          devisEnAttente: devisEnAttente.data,
          devisValidationOperateur: devisValidationOperateur.data,
          devisSigne: devisSigne.data,
          reglementOk: reglementOk.data,
          reglementEnAttente: reglementEnAttente.data,
          planificationExtension: planificationExtension.data,
          extensionOk: extensionOk.data,
          planificationBranchement: planificationBranchement.data,
          branchementOk: branchementOk.data,
          consuelRecu: consuelRecu.data,
          demandeMESRealisee: demandeMESRealisee.data,
          consuelEnAttente: consuelEnAttente.data,
          demandeMESEnAttente: demandeMESEnAttente.data,
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);
  const handleCardClick = type => {
    dashFilesService.downloadExcel(type);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="business"
                title="DR Produit"
                count={data.drProduit}
                onClick={() => handleCardClick('drProduit')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="receipt"
                title="Devis recu"
                count={data.devisRecu}
                onClick={() => handleCardClick('devisRecu')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="receipt"
                title="Devis en attente"
                count={data.devisEnAttente}
                onClick={() => handleCardClick('devisEnAttente')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="receipt"
                title="Devis en attente ( validation operateur )"
                count={data.devisValidationOperateur}
                onClick={() => handleCardClick('devisEnAttenteOp')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="receipt"
                title="Devis signe"
                count={data.devisSigne}
                onClick={() => handleCardClick('devisSigne')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title="Reglement OK"
                count={data.reglementOk}
                onClick={() => handleCardClick('reglementOk')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title="Reglement en attente"
                count={data.reglementEnAttente}
                onClick={() => handleCardClick('reglementAttente')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title="Planification Extension"
                count={data.planificationExtension}
                onClick={() => handleCardClick('planificationExtension')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title="Extension OK"
                count={data.extensionOk}
                onClick={() => handleCardClick('extensionOk')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title="Planification Branchement"
                count={data.planificationBranchement}
                onClick={() => handleCardClick('planificationBranchement')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="payment"
                title="Branchement OK"
                count={data.branchementOk}
                onClick={() => handleCardClick('branchementOk')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="settings"
                title="Consuel recu"
                count={data.consuelRecu}
                onClick={() => handleCardClick('consuelRecu')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="settings"
                title="Demande de MES realisee"
                count={data.demandeMESRealisee}
                onClick={() => handleCardClick('demandeMesRealisee')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="settings"
                title="Consuel en attente"
                count={data.consuelEnAttente}
                onClick={() => handleCardClick('consuelEnAttente')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="settings"
                title="Demande de MES en attente"
                count={data.demandeMESEnAttente}
                onClick={() => handleCardClick('demandeMesEnAttente')}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <DashboardCharts />
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}
export default Dashboard;
