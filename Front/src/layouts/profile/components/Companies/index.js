// components/Companies.js
import React from 'react';
import CompanyList from './CompanyList';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
function Companies() {
  return (
    <DashboardLayout>
      <CompanyList />
    </DashboardLayout>
  );
}
export default Companies;
