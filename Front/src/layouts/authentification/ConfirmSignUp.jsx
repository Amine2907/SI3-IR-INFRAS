import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
const ConfirmSignup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('access_token');

  useEffect(() => {
    if (token) {
      console.log('Token received:', token);
    } else {
      console.error('No token found in URL.');
    }
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000);
    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <MDBContainer fluid className="p-4">
      <MDBRow>
        <MDBCol md="6" className="offset-md-3">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              <h1 className="mb-4">Confirmation de compte</h1>
              {token ? (
                <p>Votre compte a été confirmé ! Vous serez redirigé vers la page de connexion.</p>
              ) : (
                <p>
                  Votre compte n&apos;a pas pu être confirmé. Veuillez vérifier votre email pour le
                  lien de confirmation.
                </p>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
export default ConfirmSignup;
