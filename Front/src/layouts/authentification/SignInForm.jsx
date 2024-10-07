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
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthService from './services/authService';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage] = useState('');
  const [successMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSignIn = async e => {
    e.preventDefault();

    try {
      const response = await AuthService.signIn(email, password);

      if (response.success) {
        navigate('/dashboard'); // Redirect to the dashboard upon successful sign-in
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
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
            Welcome Back <br />
            <span className="text-primary">Sign in to your account</span>
          </h1>
        </MDBCol>
        <MDBCol md="6">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              <form>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
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
                {error && <p>{error}</p>}
                <MDBBtn className="w-100 mb-4" size="md" onClick={handleSignIn}>
                  Sign In
                </MDBBtn>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
              </form>
              <div className="text-center">
                <p>or sign in with:</p>
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
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignInForm;
