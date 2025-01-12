/**
 * This component renders the contacts page.
 *
 * It renders a navbar with a title and a button to add a new contact.
 * It renders a list of contacts, with a button to edit each contact.
 * It renders a modal to add or edit a contact, with a form with the contact's name, email, and phone.
 */
// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/Footer';
import ContactList from 'examples/Lists/ContactList/ContactList';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
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
