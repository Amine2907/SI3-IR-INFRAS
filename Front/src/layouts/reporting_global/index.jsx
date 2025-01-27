import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/Footer';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import ReportList from 'examples/Lists/ReportingList';
function ReportingGlobal() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ReportList />
      <Footer />
    </DashboardLayout>
  );
}
export default ReportingGlobal;
