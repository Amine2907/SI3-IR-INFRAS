/**
 * SettingsFunctions component is responsible for rendering the settings feature, which
 * contains the user information and the ability to change the password and update the user
 * data. It also handles the orientation of the tabs based on the screen size, and renders the
 * appropriate component based on the selected tab.
 *
 * @param {function} setUserData - A function to set the user data
 * @returns {Object} An object containing the state values and functions:
 *   - showModal: A boolean indicating whether the modal is open
 *   - userData: The user data object
 *   - loading: A boolean indicating whether the component is loading
 *   - error: An error string if there was an error
 *   - alert: An object with the alert message and type
 *   - currentPassword: The current password
 *   - setCurrentPassword: A function to set the current password
 *   - newPassword: The new password
 *   - setNewPassword: A function to set the new password
 *   - showPassword: A boolean indicating whether the password is visible
 *   - confirmNewPassword: The confirmed new password
 *   - setConfirmNewPassword: A function to set the confirmed new password
 *   - fetchUserData: A function to fetch the user data
 *   - handleSavePassword: A function to handle saving the new password
 *   - handleSave: A function to handle saving the updated user data
 *   - handleCloseAlert: A function to close the alert
 *   - handleEditClick: A function to handle the edit click
 *   - handleModalClose: A function to close the modal
 *   - togglePasswordVisibility: A function to toggle the password visibility
 */
import { useState, useCallback } from 'react';
import settingsService from 'services/settingsService';
import { useAuth } from 'context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
function SettingsFunctions(setUserData) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [userData, setLocalUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();
  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await settingsService.getAccountInfo(user.id);
        if (response.success && response.data) {
          setLocalUserData(response.data);
          setUserData(response.data);
        } else {
          setError(response.error?.message || 'Échec de la récupération des données utilisateur.');
        }
      } catch (err) {
        setError('An error occurred while fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('Les informations utilisateur ne sont pas disponibles');
    }
  }, [user, setUserData]);

  const handleSavePassword = async () => {
    const passwordComplexityCheck = password => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;
    };

    if (!passwordComplexityCheck(newPassword)) {
      setAlert({
        show: true,
        message:
          'Le mot de passe doit inclure des majuscules, des minuscules, un chiffre et un caractère spécial.',
        type: 'error',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAlert({
        show: true,
        message: 'Les nouveaux mots de passe ne correspondent pas.',
        type: 'error',
      });
      return;
    }
    if (newPassword.length < 8) {
      setAlert({
        show: true,
        message: 'Le mot de passe doit comporter au moins 8 caractères.',
        type: 'error',
      });
      return;
    }
    try {
      const userId = user?.id;
      if (!userId) {
        setAlert({
          show: true,
          message: "L'ID utilisateur n'est pas disponible.",
          type: 'error',
        });
        return;
      }
      let successMessage = '';
      const response = await settingsService.updatePassword(userId, currentPassword, newPassword);
      if (response.success) {
        successMessage = 'Password changed successfully.';
        setAlert({ show: true, message: successMessage, type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } else {
        const errorMessage = response.error?.message || 'Échec de la modification du mot de passe.';
        setAlert({ show: true, message: `Error: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    }
  };

  const handleSave = async data => {
    let result;
    let successMessage = '';
    try {
      if (selectedUser) {
        result = await settingsService.updateUser(selectedUser.id, data);
        successMessage = 'Utilisateur mis à jour avec succès !';
      }
      if (result && result.success) {
        setAlert({ show: true, message: successMessage, type: 'success' });
        await fetchUserData();
      } else {
        const errorMessage =
          result?.error ||
          "Une erreur inconnue s'est produite lors de la mise à jour de l'utilisateur.";
        setAlert({ show: true, message: `Error: ${errorMessage}`, type: 'error' });
      }
    } catch (error) {
      setAlert({ show: true, message: `Error: ${error.message}`, type: 'error' });
    } finally {
      handleModalClose();
    }
  };

  const handleCloseAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };

  const handleEditClick = () => {
    setSelectedUser(userData);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    showModal,
    setShowModal,
    userData,
    setLocalUserData,
    loading,
    error,
    alert,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    showPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    fetchUserData,
    handleSavePassword,
    handleSave,
    handleCloseAlert,
    handleEditClick,
    handleModalClose,
    togglePasswordVisibility,
  };
}
export default SettingsFunctions;
