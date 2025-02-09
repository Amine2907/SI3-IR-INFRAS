import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SiteDevisService from 'services/site_details/Devis/DevisService';

const useDevisForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [devisData, setDevisData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;
  // Function to fetch deviss data
  const fetchdevisData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch fournisseurs for the site
      const fournisseurResponse = await SiteDevisService.getActiveFrnsForDevis(siteId);
      if (!fournisseurResponse.success) {
        throw new Error(`Failed to fetch fournisseurs for site ID: ${siteId}`);
      }
      // Fetch devis for the site
      const devisResponse = await SiteDevisService.getDevisSite(siteId);
      if (!devisResponse.success) throw new Error('Failed to fetch devis');

      // Sort devis by creation time in descending order (newest first)
      const sortedDevis = devisResponse.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setDevisData(sortedDevis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Initial fetch when siteId changes
  useEffect(() => {
    if (siteId) {
      fetchdevisData();
    }
  }, [siteId]);
  return { devisData, loading, error, fetchdevisData };
};
export default useDevisForSite;
