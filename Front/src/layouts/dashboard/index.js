import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';
import dashboardService from 'services/Dashboard/dashService';
import reportsBarChartData from './data/reportsBarChartData';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart';
import dashFilesService from 'services/Dashboard/dashFilesService';
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
    console.log('Clicked type:', type);
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
                icon="weekend"
                title="DR Produit"
                count={data.drProduit}
                onClick={() => handleCardClick('drProduit')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Devis recu"
                count={data.devisRecu}
                onClick={() => handleCardClick('devisRecu')}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Devis en attente"
                count={data.devisEnAttente}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Devis en attente ( validation operateur )"
                count={data.devisValidationOperateur}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Devis signe"
                count={data.devisSigne}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Reglement OK"
                count={data.reglementOk}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Reglement en attente"
                count={data.reglementEnAttente}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Planification Extension"
                count={data.planificationExtension}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Extension OK"
                count={data.extensionOk}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Planification Branchement"
                count={data.planificationBranchement}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Branchement OK"
                count={data.branchementOk}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Consuel recu"
                count={data.consuelRecu}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Demande de MES realisee"
                count={data.demandeMESRealisee}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Consuel en attente"
                count={data.consuelEnAttente}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Demande de MES en attente"
                count={data.demandeMESEnAttente}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date=""
                  chart={''}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={''}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Dashboard;
