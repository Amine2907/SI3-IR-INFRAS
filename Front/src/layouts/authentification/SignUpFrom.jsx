/*************  ✨ Codeium Command ⭐  *************/
/**
 * This page is responsible for signing up a user.
 *
 * It renders a form with an email, first name, and last name field. When the
 * user submits the form, it will send a POST request to the backend to sign
 * the user up.
 *
 * @return {React.ReactElement} The sign up page.
 */
/******  2b93c012-220e-4df8-9642-e02a8e4ff607  *******/
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
import AuthService from 'services/authService';
function SignUpForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async e => {
    e.preventDefault();
    try {
      const response = await AuthService.signUp(firstName, lastName, email, password);
      if (response && response.success) {
        if (response.data && response.data.message) {
          setSuccessMessage(response.data.message);
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
        } else {
          setSuccessMessage('Inscription réussie ! Veuillez vérifier votre e-mail.');
        }
        setErrorMessage('');
      } else {
        setErrorMessage(response?.data?.message || "L'inscription a échoué. Veuillez réessayer.");
        setSuccessMessage('');
      }
    } catch (error) {
      console.error("Erreur d'inscription", error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de l'inscription. Veuillez réessayer."
      );
      setSuccessMessage('');
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
            Bienvenue au <span className="text-primary">SI3</span>
            <br />
            {/* <span className="text-primary">for your business</span> */}
          </h1>
          <p className="px-3" style={{ color: 'hsl(217, 10%, 50.8%)' }}>
            SI3 aide à stocker, organiser et sécuriser les données tout au long du cycle de vie de
            la construction des pylônes. Avec SI3, contrôlez le projet et collaborez en toute
            simplicité.
            <br />
            Répertoires des parties prenantes
            <br />
            Stockage des information des sites
            <br />
            Gestion des tâches
            <br />
            Suivre les activities de chaque site
            <br />
            Suivre le statut de réglement des devis
            <br />
            Notifications automatisées
            <br />
            Sassurer que le projet est sur les rails
            <br />
            Rapports et analyses avancés pour prendre les bonnes decisions
          </p>
        </MDBCol>
        <MDBCol md="6">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Prénom"
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </MDBCol>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Nom"
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Mot de passe"
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <MDBBtn className="w-100 mb-4" size="md" onClick={handleSignUp}>
                S&apos;inscrire
              </MDBBtn>
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

              <div className="text-center">
                <p>Ou inscrivez-vous avec :</p>
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
export default SignUpForm;
