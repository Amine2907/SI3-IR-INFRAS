/**
 * Overview page for the settings page.
 *
 * This page is the first page a user will see when they visit the settings page.
 * It provides a brief overview of the settings available to the user.
 */
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// Overview page components
import Header from 'layouts/settings/components/Header';
function Overview() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header></Header>
      <Footer />
    </DashboardLayout>
  );
}
export default Overview;
