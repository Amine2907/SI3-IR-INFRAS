import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import sitePaiementService from 'services/site_details/Reglement/Paiement/PaiementService';

const useReglForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paiementData, setPaiementData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;

  // Function to fetch payment data
  const fetchPaiementData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch payment data for the site
      const paiementResponse = await sitePaiementService.getPaieSite(siteId);
      if (!paiementResponse.success) {
        throw new Error(`Failed to fetch payment details for site ID: ${siteId}`);
      }

      // Set the payment data
      setPaiementData(paiementResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when siteId changes
  useEffect(() => {
    if (siteId) {
      fetchPaiementData();
    }
  }, [siteId]);

  return { paiementData, loading, error, fetchPaiementData };
};

export default useReglForSite;
