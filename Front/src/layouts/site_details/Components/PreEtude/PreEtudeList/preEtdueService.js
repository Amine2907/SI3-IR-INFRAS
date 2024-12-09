import { useEffect, useState } from 'react';
import SitePreEtudeService from 'services/site_details/PreEtude/preEtudeService';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import { useLocation } from 'react-router-dom';

const usePreEtudesForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preEtudeData, setPreEtudeData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;

  useEffect(() => {
    const fetchPreEtudeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch prospects for the site
        console.log(`Fetching prospects for site ID: ${siteId}`);
        const prospectsResponse = await SiteProspectService.getProspectsSite(siteId);
        if (!prospectsResponse.success) {
          throw new Error(`Failed to fetch prospects for site ID: ${siteId}`);
        }

        const prospects = prospectsResponse.data;
        console.log('Fetched prospects:', prospects);

        // Fetch preÉtudes for each prospect and map the prospect name
        const allPreEtudes = await Promise.all(
          prospects.map(async prospect => {
            console.log(`Fetching preÉtudes for prospect ID: ${prospect.Proid}`);
            const preEtudeResponse = await SitePreEtudeService.getPreEtudeProspect(prospect.Proid);
            if (!preEtudeResponse.success) {
              console.error(`Failed to fetch preÉtudes for prospect ID: ${prospect.Proid}`);
              return [];
            }
            console.log(
              `Fetched preÉtudes for prospect ID: ${prospect.Proid}`,
              preEtudeResponse.data
            );

            return preEtudeResponse.data.map(preEtude => ({
              ...preEtude,
              prospectName: prospect.nom, // Include the prospect name
            }));
          })
        );

        // Combine all results into a flat array
        const combinedPreEtudes = allPreEtudes.flat();
        console.log('Combined preÉtudes:', combinedPreEtudes);

        setPreEtudeData(combinedPreEtudes);
      } catch (err) {
        console.error('Error fetching preÉtudes:', err.message);
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
