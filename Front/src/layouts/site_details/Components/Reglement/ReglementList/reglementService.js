import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sitereglementervice from 'services/site_details/Devis/reglementervice';

const useReglForSite = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reglData , setReglData] = useState([]);
  const location = useLocation();
  const { EB } = location.state || {};
  const siteId = EB;
  // Function to fetch reglement data
  const fetchReglData  = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch fournisseurs for the site
      const fournisseurResponse = await Sitereglementervice.getActiveFrnsForDevis(siteId);
      if (!fournisseurResponse.success) {
        throw new Error(`Failed to fetch fournisseurs for site ID: ${siteId}`);
      }
      const fournisseurs = fournisseurResponse.data;
      // Fetch devis for the site
      const reglementResponse = await Sitereglementervice.getreglementite(siteId);
      if (!reglementResponse.success) throw new Error('Failed to fetch devis');
      const reglement = reglementResponse.data;

      // Enrich devis  with forunisseur names (if there’s no explicit linkage)
      const enrichedRegl = reglement.map((devis, index) => ({
        ...devis,
        fournisseurName: fournisseurs[index]?.nom || 'Unknown', // Assign fournisseur name cyclically or as a fallback
      }));
      // Set the preÉtude data with fournisseur names included
      setReglData(enrichedRegl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Initial fetch when siteId changes
  useEffect(() => {
    if (siteId) {
      fetchReglData ();
    }
  }, [siteId]);
  return { reglData , loading, error, fetchReglData  };
};
export default useReglForSite;
