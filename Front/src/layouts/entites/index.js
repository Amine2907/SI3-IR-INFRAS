/**
 * Entites component
 *
 * This component renders the main layout for the entities page.
 * It includes the navigation bar, the list of entities, and the footer.
 * It uses the DashboardLayout component to structure the page.
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
