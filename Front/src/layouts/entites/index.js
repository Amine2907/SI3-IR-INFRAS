// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/Footer';
import EntiteNavBr from 'examples/Navbars/EntiteNavbar';
// import EntiteListView from 'examples/Lists/ProfilesList/EntitesList/EntiteListView';
import EntiteList from 'examples/Lists/ProfilesList/EntitesList/EntiteList';
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
