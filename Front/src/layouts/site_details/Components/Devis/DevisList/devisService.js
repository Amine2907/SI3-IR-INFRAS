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
      const fournisseurs = fournisseurResponse.data;

      // Fetch devis for the site
      const devisResponse = await SiteDevisService.getDevisSite(siteId);
      if (!devisResponse.success) throw new Error('Failed to fetch devis');
      const deviss = devisResponse.data;

      // Enrich devis  with forunisseur names (if there’s no explicit linkage)
      const enrichedDevis = deviss.map((devis, index) => ({
        ...devis,
        fournisseurName: fournisseurs[index]?.nom || 'Unknown', // Assign fournisseur name cyclically or as a fallback
      }));
      // Set the preÉtude data with fournisseur names included
      setDevisData(enrichedDevis);
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
