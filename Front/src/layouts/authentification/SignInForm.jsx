import React, { useState } from 'react';
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
  MDBIcon,
} from 'mdb-react-ui-kit';
import { useAuth } from 'context/Auth/AuthContext';
import AuthService from 'authService';
import { useNavigate } from 'react-router-dom';
function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();
  const { login, reset } = useAuth();
  // Handle Sign in function
  const handleSignIn = async e => {
    e.preventDefault(); // Prevent the default form submission
    const response = await AuthService.signIn(email, password);
    // Check the response
    if (response.success === false) {
      setErrorMessage('Invalid credentials, please try again.');
    } else {
      console.log('Sign-in successful:', response);
      login();
      navigate('/dashboard');
    }
  };
  // Handle Reset Password function
  const handleResetPassword = async e => {
    e.preventDefault();
    const response = await AuthService.resetPassword(resetEmail);
    if (response.success) {
      reset();
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      navigate('/auth');
    } else {
      setSuccessMessage('');
      setErrorMessage(response.error);
    }
  };
  return (
    <MDBContainer fluid className="p-4">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            Bon retour <br />
            <span className="text-primary">Connectez-vous à votre compte</span>
          </h1>
        </MDBCol>
        <MDBCol md="6">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              {!showResetForm ? (
                <form>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <MDBBtn className="w-100 mb-4" size="md" onClick={handleSignIn}>
                    Se connecter
                  </MDBBtn>
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                </form>
              ) : (
                <form>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Enter your email"
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                  />
                  <MDBBtn className="w-100 mb-4" size="md" onClick={handleResetPassword}>
                    Send Reset Link
                  </MDBBtn>
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                  <p
                    onClick={() => setShowResetForm(false)}
                    style={{ cursor: 'pointer', color: 'blue' }}
                  >
                    Retour à la connexion
                  </p>
                </form>
              )}
              {/* Forgot password link */}
              {!showResetForm && (
                <p
                  onClick={() => setShowResetForm(true)}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  Mot de passe oublié ?
                </p>
              )}
              {/* {showResetForm && ( */}
              <div className="text-center">
                <p>Ou connectez-vous avec :</p>
                <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="facebook-f" size="sm" />
                </MDBBtn>

                <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="twitter" size="sm" />
                </MDBBtn>

                <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="google" size="sm" />
                </MDBBtn>

                <MDBBtn tag="a" color="none" className="mx-3" style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon="github" size="sm" />
                </MDBBtn>
              </div>
              {/*  )} */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
export default SignInForm;
