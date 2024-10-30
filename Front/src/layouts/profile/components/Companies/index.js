// components/Companies.js
/**
 * Companies component
 *
 * This component renders the CompanyList component, which displays a list of companies.
 */
import React from 'react';
import CompanyList from '../../../../examples/Lists/CompanyList';
// import { useState } from 'react';
function Companies() {
  // const [setNoResultsMessage] = useState('');
  return <CompanyList />;
}
export default Companies;
