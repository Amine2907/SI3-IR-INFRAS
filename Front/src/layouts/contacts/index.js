// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/Footer';
import ContactList from 'examples/Lists/ProfilesList/ContactList/ContactList';
import ContactNavBar from 'examples/Navbars/ConatctNavbar';
function Contacts() {
  return (
    <DashboardLayout>
      <ContactNavBar />
      <ContactList />
      <Footer />
    </DashboardLayout>
  );
}
export default Contacts;
