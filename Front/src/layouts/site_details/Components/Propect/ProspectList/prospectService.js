import { useState, useCallback } from 'react';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import { useLocation } from 'react-router-dom';
const useProspectsData = site => {
  const [prospectsData, setProspectsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const fetchProspectsData = useCallback(async () => {
    if (Sid) {
      try {
        setLoading(true);
        const response = await SiteProspectService.getProspectsSite(Sid);
        if (response.success && response.data) {
          setProspectsData(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          setError(response.error?.message || 'Échec de la récupération des données des prospects');
        }
      } catch (err) {
        setError('An error occurred while fetching prospects data: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('Les prospects de ce site ne sont pas disponibles');
    }
  }, [site]);
  return { prospectsData, loading, error, fetchProspectsData, setProspectsData };
};
export default useProspectsData;
