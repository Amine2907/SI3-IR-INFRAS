import { useEffect, useState } from 'react';
import ProspectDpService from 'services/site_details/DP/DpService';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import { useLocation } from 'react-router-dom';
const useDpsForProspects = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dpsData, setDpsData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch Prospects for the Site
        const prospectsResponse = await SiteProspectService.getProspectsBySite(siteId);
        if (!prospectsResponse.success) throw new Error('Failed to fetch prospects');

        const prospects = prospectsResponse.data;

        // Step 2: Fetch DPs for Each Prospect
        const allDps = await Promise.all(
          prospects.map(async prospect => {
            const dpsResponse = await ProspectDpService.getDpsByProspect(prospect.id);
            if (!dpsResponse.success) throw new Error('Failed to fetch DPs');
            return dpsResponse.data.map(dp => ({
              ...dp,
              prospectName: prospect.nom, // Add prospect info for context
            }));
          })
        );
        // Flatten the array of arrays into a single array
        setDpsData(allDps.flat());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (siteId) {
      fetchData();
    }
  }, [siteId]);

  return { dpsData, loading, error };
};
export default useDpsForProspects;
