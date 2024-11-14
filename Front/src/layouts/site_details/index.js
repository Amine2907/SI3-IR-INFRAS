// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
// Overview page components
import Header from './Components/Header';

function SiteDetails() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header />
      <Footer />
    </DashboardLayout>
  );
}
export default SiteDetails;
