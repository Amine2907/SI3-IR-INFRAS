import { useState, useCallback } from 'react';
import SiteDemracService from 'services/site_details/DR/DrService';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import { useLocation } from 'react-router-dom';
const usedemracData = () => {
  const [demracData, setdemracData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;

  const fetchDemracData = useCallback(async () => {
    if (Sid) {
      try {
        setLoading(true);
        setError(null);

        // Fetch prospects for the site
        const prospectsResponse = await SiteProspectService.getProspectsSite(Sid);
        if (!prospectsResponse.success) {
          throw new Error(`Failed to fetch prospects for site ID: ${Sid}`);
        }
        const prospects = prospectsResponse.data;

        // Fetch DR data for the site
        const drResponse = await SiteDemracService.getDemRacSite(Sid);
        if (!drResponse.success || !drResponse.data) {
          throw new Error(
            drResponse.error?.message ||
              'Échec de la récupération des données des demandes de raccordements'
          );
        }

        const drData = drResponse.data;

        // Enrich DR data with prospect names
        const enrichedDrData = drData.map(dr => {
          const matchingProspect = prospects.find(prospect => prospect.Proid === dr.Pro_fk);
          return {
            ...dr,
            prospectName: matchingProspect?.nom || 'Unknown', // Use 'Unknown' if no matching prospect is found
          };
        });

        setdemracData(enrichedDrData);
      } catch (err) {
        setError(
          "Une erreur s'est produite lors de la récupération des données des demandes de raccordements : " +
            err.message
        );
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('Les demandes de raccordements de ce site ne sont pas disponibles');
    }
  }, [Sid]);

  return { demracData, loading, error, fetchDemracData, setdemracData };
};

export default usedemracData;
