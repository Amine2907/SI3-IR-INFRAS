/**
 * Entites Page
 *
 * This page renders the EntiteNavBr and an EntiteList.
 *
 * See https://github.com/creativetimofficial/material-dashboard-react/blob/v2.2.0/docs/getting-started/structure.md
 * for a description of the components and layout.
 */
// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/Footer';
import EntiteNavBr from 'examples/Navbars/EntiteNavbar';
import EntiteList from 'examples/Lists/EntitesList/EntiteList';
function Entites() {
  return (
    <DashboardLayout>
      <EntiteNavBr />
      <EntiteList />
      <Footer />
    </DashboardLayout>
  );
}
export default Entites;
