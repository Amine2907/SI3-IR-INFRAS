import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthService } from 'back';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit';
const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const access_token = urlParams.get('access_token');
  const handleResetPassword = async e => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    const result = await AuthService.confirmResetPassword(newPassword, access_token);
    if (result.success) {
      setSuccessMessage('Votre mot de passe a été réinitialisé avec succès !');
      setErrorMessage(''); // Clear error message on success
    } else {
      setErrorMessage(result.error);
      setSuccessMessage(''); // Clear success message on error
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
};
export default ResetPasswordForm;
