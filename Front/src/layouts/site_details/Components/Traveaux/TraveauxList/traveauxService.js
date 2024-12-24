import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import siteTravService from 'services/site_details/Traveaux/TraveauxService';

const useTravForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [traveauxData, setTraveauxData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;
  // Function to fetch traveaux data
  const fecthTravData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch traveaux data for the site
      const traveauxResponse = await siteTravService.getTravSite(siteId);
      if (!traveauxResponse.success) {
        throw new Error(`Failed to fetch traveaux details for site ID: ${siteId}`);
      }
      // Set the traveaux data
      setTraveauxData(traveauxResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when siteId changes
  useEffect(() => {
    if (siteId) {
      fecthTravData();
    }
  }, [siteId]);

  return { traveauxData, loading, error, fecthTravData };
};
export default useTravForSite;
