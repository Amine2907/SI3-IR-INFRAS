// src/components/SettingsFunctions.js

import { useState, useCallback } from 'react';
import settingsService from 'services/settingsService';
import { useAuth } from 'context/Auth/AuthContext';
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
          setError(response.error?.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError('An error occurred while fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('User information is not available');
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
        message: 'Password must include uppercase, lowercase, number, and special character.',
        type: 'error',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAlert({ show: true, message: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (newPassword.length < 8) {
      setAlert({
        show: true,
        message: 'Password must be at least 8 characters long.',
        type: 'error',
      });
      return;
    }
    try {
      const userId = user?.id;
      if (!userId) {
        setAlert({ show: true, message: 'User ID is not available.', type: 'error' });
        return;
      }
      const response = await settingsService.updatePassword(userId, currentPassword, newPassword);
      if (response.success) {
        setAlert({ show: true, message: 'Password changed successfully.', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorMessage = response.error?.message || 'Failed to change password';
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
        successMessage = 'User updated successfully!';
      }
      if (result && result.success) {
        setAlert({ show: true, message: successMessage, type: 'success' });
        await fetchUserData();
      } else {
        const errorMessage = result?.error || 'Unknown error occurred while updating user.';
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
