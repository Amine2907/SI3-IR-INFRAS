import React, { useState, useEffect } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from 'mdb-react-ui-kit';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from 'my-backend/services/AuthService';
function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('access_token');
    setToken(tokenFromUrl);
  }, [location]);

  const handleResetPassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    const response = await AuthService.confirmResetPassword(newPassword, token);
    if (response.success) {
      setSuccessMessage('Votre mot de passe a été réinitialisé avec succès.');
      setErrorMessage('');
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } else {
      setErrorMessage(response.error || 'Erreur lors de la réinitialisation du mot de passe.');
      setSuccessMessage('');
    }
  };
  return (
    <MDBContainer fluid className="p-4">
      <MDBRow>
        <MDBCol md="6" className="offset-md-3">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              <h1 className="mb-4">Réinitialiser le mot de passe</h1>
              <form onSubmit={handleResetPassword}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Nouveau mot de passe"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Confirmer le mot de passe"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <MDBBtn className="w-100 mb-4" size="md" type="submit">
                  Réinitialiser le mot de passe
                </MDBBtn>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ResetPasswordForm;
