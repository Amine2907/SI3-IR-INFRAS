// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ContactList from 'examples/Lists/ProfilesList/ContactList/ContactList';
function Contacts() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ContactList />
      <Footer />
    </DashboardLayout>
  );
}
export default Contacts;
