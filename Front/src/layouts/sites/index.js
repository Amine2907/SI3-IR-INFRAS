/**
 * Sites component
 *
 * This component renders the main layout for the Sites page.
 * It includes the navigation bar, the list of Sites, and the footer.
 * It uses the DashboardLayout component to structure the page.
 */
// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/Footer';
import SiteList from 'examples/Lists/SiteList/SiteList';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
function Sites() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SiteList />
      <Footer />
    </DashboardLayout>
  );
}
export default Sites;
