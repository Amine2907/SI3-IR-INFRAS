import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import siteFactureService from 'services/site_details/Reglement/Facture/FactureService';

const useFactureForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [factureData, setFactureData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;
  // Function to fetch traveaux data
  const fetchFactureData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch traveaux data for the site
      const mesResponse = await siteFactureService.getFactureSite(siteId);
      if (!mesResponse.success) {
        throw new Error(`Failed to fetch factures  details for site ID: ${siteId}`);
      }
      // Set the traveaux data
      setFactureData(mesResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Initial fetch when siteId changes
  useEffect(() => {
    if (siteId) {
      fetchFactureData();
    }
  }, [siteId]);

  return { factureData, loading, error, fetchFactureData };
};
export default useFactureForSite;
