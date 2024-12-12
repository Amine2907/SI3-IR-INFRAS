import { useState, useCallback } from 'react';
import SiteDemracService from 'services/site_details/DR/DrService';
import { useLocation } from 'react-router-dom';
const usedemracData = site => {
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
        const response = await SiteDemracService.getDemRacSite(Sid);
        if (response.success && response.data) {
          setdemracData(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          setError(
            response.error?.message ||
              'Échec de la récupération des données des demandes de raccordements'
          );
        }
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
  }, [site]);
  return { demracData, loading, error, fetchDemracData, setdemracData };
};
export default usedemracData;
