import { useEffect, useState } from 'react';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import ProspectDpService from 'services/site_details/DP/DpService';
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
        const prospectsResponse = await SiteProspectService.getProspectsSite(siteId);
        if (!prospectsResponse.success) throw new Error('Failed to fetch prospects');
        const prospects = prospectsResponse.data;
        // Step 2: Fetch DPs for Each Prospect
        const allDps = await Promise.all(
          prospects.map(async prospect => {
            const dpsResponse = await ProspectDpService.getDpsProspect(prospect.Proid);
            if (!dpsResponse.success) throw new Error('Failed to fetch DPs');
            return dpsResponse.data.map(dp => ({
              ...dp,
              prospectName: prospect.nom,
            }));
          })
        );
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
