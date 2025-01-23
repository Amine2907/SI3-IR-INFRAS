/* eslint-disable */
import React, { useEffect, useState } from 'react';
import reportingFileService from 'services/ReportingGlobal/reportingService';
import MDTypography from 'components/MDTypography';
const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const reportsData = await reportingFileService.listReports();
      setReports(reportsData);
    };
    fetchReports();
  }, []);

  const handleDownload = async filename => {
    const signedUrl = await reportingFileService.getSignedUrl(filename);
    if (signedUrl) {
      window.open(signedUrl, '_blank');
    }
  };
  return (
    <div>
      <MDTypography variant="h3">Available Reports</MDTypography>
      {error && <div>Error: {error}</div>}
      <ul>
        {reports.map(report => (
          <li key={report.name}>
            {report.name}
            <button onClick={() => handleDownload(report.name)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ReportList;
