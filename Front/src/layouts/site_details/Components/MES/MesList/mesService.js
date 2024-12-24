import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import siteMesService from 'services/site_details/MES/MesService';

const useMesForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mesData, setmesData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;
  // Function to fetch traveaux data
  const fetchMesData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch traveaux data for the site
      const mesResponse = await siteMesService.getMesSite(siteId);
      if (!mesResponse.success) {
        throw new Error(`Failed to fetch mise en service details for site ID: ${siteId}`);
      }
      // Set the traveaux data
      setmesData(mesResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when siteId changes
  useEffect(() => {
    if (siteId) {
      fetchMesData();
    }
  }, [siteId]);

  return { mesData, loading, error, fetchMesData };
};
export default useMesForSite;
