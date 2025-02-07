import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import MDBox from 'components/MDBox';
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from 'recharts';
import dashChartsService from 'services/Dashboard/dashChartsService';
import MDTypography from 'components/MDTypography';

const PROGRAMMES = {
  1: '4GFixe',
  2: 'DCC',
  3: 'ARP',
  4: 'DENSIF_CZ_RED',
  5: 'DENSIF_CZ',
  6: 'ZTD_RED',
  7: 'PAC-REMP',
  8: 'PAC',
  9: 'PAC-DUP',
  10: 'PAC-CONTINUITY-PLAN',
  11: 'FM',
  12: 'ORF',
  13: 'SFR TT',
  14: 'FM TT',
};

// Default Programs List
const DEFAULT_PROGRAMS = Object.values(PROGRAMMES);

function DashboardCharts() {
  const [chartsData, setChartsData] = useState({
    dr: [],
    devisRecu: [],
    devisEnAttente: [],
    devisSigne: [],
    devisValidationOperateur: [],
    reglementOk: [],
    reglementEnAttente: [],
    planificationExtension: [],
    extensionOk: [],
    planificationBranchements: [],
    branchementOk: [],
    consuelRecu: [],
    demandeMESRealisee: [],
    consuelEnAttente: [],
    demandeMESEnAttente: [],
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

  // Format DR data to ensure all programs are included
  const formatDRData = data => {
    return DEFAULT_PROGRAMS.map(program => {
      const programData = data.find(item => item.programme === program);
      return {
        programme: program,
        count: programData ? programData.count : 0,
      };
    });
  };
  const formatChartData = data => {
    return DEFAULT_PROGRAMS.map(program => {
      const programData = data.find(item => item.programme === program);
      return {
        programme: program,
        count: programData ? programData.count : 0, // Default to 0 if no data
      };
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          dr,
          devisRecu,
          devisEnAttente,
          devisSigne,
          devisValidationOperateur,
          reglementOk,
          reglementEnAttente,
          planificationExtension,
          extensionOk,
          planificationBranchements,
          branchementOk,
          consuelRecu,
          demandeMESRealisee,
          consuelEnAttente,
          demandeMESEnAttente,
        ] = await Promise.all([
          dashChartsService.getDRCountByProgramme(),
          dashChartsService.getDevisRecuByProgramme(),
          dashChartsService.getDevisEnAttenteByProgramme(),
          dashChartsService.getDevisSigneByProgramme(),
          dashChartsService.getDevisValidationOperateurByProgramme(),
          dashChartsService.getReglementOkByProgramme(),
          dashChartsService.getReglementEnAttenteByProgramme(),
          dashChartsService.getPlanificationExtensionByProgramme(),
          dashChartsService.getExtensionOkByProgramme(),
          dashChartsService.getPlanificationBranchementsByProgramme(),
          dashChartsService.getBranchementOkByProgramme(),
          dashChartsService.getConsuelRecuByProgramme(),
          dashChartsService.getDemandeMESRealiseeByProgramme(),
          dashChartsService.getConsuelEnAttenteByProgramme(),
          dashChartsService.getDemandeMESEnAttenteByProgramme(),
        ]);

        setChartsData({
          dr: formatDRData(dr.data),
          devisRecu: formatChartData(devisRecu.data),
          devisEnAttente: formatChartData(devisEnAttente.data),
          devisSigne: formatChartData(devisSigne.data),
          devisValidationOperateur: formatChartData(devisValidationOperateur.data),
          reglementOk: formatChartData(reglementOk.data),
          reglementEnAttente: formatChartData(reglementEnAttente.data),
          planificationExtension: formatChartData(planificationExtension.data),
          extensionOk: formatChartData(extensionOk.data),
          planificationBranchements: formatChartData(planificationBranchements.data),
          branchementOk: formatChartData(branchementOk.data),
          consuelRecu: formatChartData(consuelRecu.data),
          demandeMESRealisee: formatChartData(demandeMESRealisee.data),
          consuelEnAttente: formatChartData(consuelEnAttente.data),
          demandeMESEnAttente: formatChartData(demandeMESEnAttente.data),
        });

        console.log('Chart data fetched and formatted successfully!');
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  const renderBarChart = (data, title) => (
    <Grid item xs={12}>
      <MDBox mb={3}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data.length ? data : [{ programme: "Pas d'informations", count: 0 }]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="programme" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Nombre" />
          </BarChart>
        </ResponsiveContainer>
      </MDBox>
    </Grid>
  );

  const renderRadarChart = (data, title) => (
    <Grid item xs={12} md={6}>
      <MDBox mb={3}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data.length ? data : [{ programme: "Pas d'informations", count: 0 }]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="programme" />
            <PolarRadiusAxis />
            <Radar
              name="Nombre"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </MDBox>
    </Grid>
  );

  const renderPieChart = (data, title) => {
    const hasData = data.some(item => item.count > 0);
    return (
      <Grid item xs={12} md={6}>
        <MDBox mb={3}>
          <h3>{title}</h3>
          <ResponsiveContainer width="100%" height={400}>
            {hasData ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="programme"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                <MDTypography>Pas d&apos;informations</MDTypography>
              </MDBox>
            )}
          </ResponsiveContainer>
        </MDBox>
      </Grid>
    );
  };

  const renderLineChart = (data, title) => (
    <Grid item xs={12} md={6}>
      <MDBox mb={3}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data.length ? data : [{ programme: "Pas d'informations", count: 0 }]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="programme" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" name="Nombre" />
          </LineChart>
        </ResponsiveContainer>
      </MDBox>
    </Grid>
  );

  return (
    <MDBox mt={4.5}>
      <Grid container spacing={3}>
        {renderBarChart(chartsData.dr, 'DR par programme')}
        {renderRadarChart(chartsData.devisRecu, 'Devis reçu par programme')}
        {renderRadarChart(chartsData.devisEnAttente, 'Devis en attente par programme')}
        {renderRadarChart(chartsData.devisSigne, 'Devis signé par programme')}
        {renderRadarChart(
          chartsData.devisValidationOperateur,
          'Devis validation opérateur par programme'
        )}
        {renderPieChart(chartsData.reglementOk, 'Règlement OK par programme')}
        {renderPieChart(chartsData.reglementEnAttente, 'Règlement en attente par programme')}
        {renderLineChart(
          chartsData.planificationExtension,
          'Planification extension par programme'
        )}
        {renderLineChart(chartsData.extensionOk, 'Extension OK par programme')}
        {renderLineChart(
          chartsData.planificationBranchements,
          'Planification branchements par programme'
        )}
        {renderLineChart(chartsData.branchementOk, 'Branchement OK par programme')}
        {renderPieChart(chartsData.consuelRecu, 'Consuel reçu par programme')}
        {renderPieChart(chartsData.demandeMESRealisee, 'Demande MES réalisée par programme')}
        {renderPieChart(chartsData.consuelEnAttente, 'Consuel en attente par programme')}
        {renderPieChart(chartsData.demandeMESEnAttente, 'Demande MES en attente par programme')}
      </Grid>
    </MDBox>
  );
}
export default DashboardCharts;
