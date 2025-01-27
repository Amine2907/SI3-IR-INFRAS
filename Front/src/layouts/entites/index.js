/**
 * Entites component
 *
 * This component renders the main layout for the entities page.
 * It includes the navigation bar, the list of entities, and the footer.
 * It uses the DashboardLayout component to structure the page.
 */
// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import EntiteList from 'examples/Lists/EntitesList/EntiteList';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
function Entites() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <EntiteList />
    </DashboardLayout>
  );
}
export default Entites;
