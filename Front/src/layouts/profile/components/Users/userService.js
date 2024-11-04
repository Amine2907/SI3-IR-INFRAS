/**
 * Hook to fetch user data from the server, given a user object.
 * Returns an object with the following properties:
 * - userData: an array of user data objects, or an empty array if the user is null
 * - loading: a boolean indicating whether the data is being fetched
 * - error: an error string if there was an error, or null if there was no error
 * - fetchUserData: a function to fetch the data
 * - setUserData: a function to set the data
 */
import { useState, useCallback } from 'react';
import settingsService from 'services/settingsService';

const useUserData = user => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await settingsService.getAccountInfo(user.id);
        if (response.success && response.data) {
          setUserData(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          setError(response.error?.message || 'Échec de la récupération des données utilisateur');
        }
      } catch (err) {
        setError('An error occurred while fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError("Les informations sur l'utilisateur ne sont pas disponibles");
    }
  }, [user]);

  return { userData, loading, error, fetchUserData, setUserData };
};
export default useUserData;
