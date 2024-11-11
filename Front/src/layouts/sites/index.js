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
import SiteNavbar from 'examples/Navbars/SitesNavbar';
import SiteList from 'examples/Lists/SiteList/SiteList';
function Sites() {
  return (
    <DashboardLayout>
      <SiteNavbar />
      <SiteList />
      <Footer />
    </DashboardLayout>
  );
}
export default Sites;
