'use client';
import React, { useEffect, useState } from 'react';
import reportingFileService from 'services/ReportingGlobal/reportingService';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Button } from 'components/ui/button';
import { Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'components/ui/alert';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await reportingFileService.listReports();
        setReports(reportsData);
      } catch (err) {
        setError('Failed to fetch reports. Please try again later.');
      }
    };
    fetchReports();
  }, []);

  //   const handleDownload = async filename => {
  //     try {
  //       const response = await reportingFileService.downloadReportFile(filename);

  //       if (response.success && response.data) {
  //         const blob = new Blob([response.data], {
  //           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         });
  //         const link = document.createElement('a');
  //         link.href = URL.createObjectURL(blob);
  //         link.download = filename;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //       } else {
  //         throw new Error(response.error || 'Failed to download the file.');
  //       }
  //     } catch (err) {
  //       console.error('Error downloading the report:', err);
  //       setError('Failed to download the report. Please try again later.');
  //     }
  //   };
  const handleDownloadFile = type => {
    reportingFileService.downloadExcel(type);
  };
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rapports Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {reports.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de rapport</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(report => (
                <TableRow key={report.name}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile('reportingNormal')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Telecharger
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground">Pas de rapports disponibles.</p>
        )}
      </CardContent>
    </Card>
  );
};
export default ReportList;
