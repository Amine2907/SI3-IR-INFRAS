import { useEffect, useState } from 'react';
import SitePreEtudeService from 'services/site_details/PreEtude/preEtudeService';
import { useLocation } from 'react-router-dom';

const usePreEtudesForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preEtudeData, setPreEtudeData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {}; // Assuming the site ID is passed here
  const siteId = EB;

  useEffect(() => {
    const fetchPreEtudeData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch preEtudes for the site (you might need to modify the method if it requires specific params)
        const preEtudesResponse = await SitePreEtudeService.getPreEtudesSite(siteId);
        if (!preEtudesResponse.success) throw new Error('Failed to fetch preEtudes');
        // Assuming the API returns an array of preEtudes
        const preEtudes = preEtudesResponse.data;
        // Set the preEtude data
        setPreEtudeData(preEtudes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (siteId) {
      fetchPreEtudeData();
    }
  }, [siteId]);

  return { preEtudeData, loading, error };
};
export default usePreEtudesForSite;
