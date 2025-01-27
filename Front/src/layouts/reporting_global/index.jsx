import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import ReportList from 'examples/Lists/ReportingList';
function ReportingGlobal() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ReportList />
    </DashboardLayout>
  );
}
export default ReportingGlobal;
