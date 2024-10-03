import { useState } from "react";
import axios from "axios";
import React from "react";
import * as Components from "./Components";

const Auth = () => {
  const [signIn, toggle] = React.useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Sign Up
  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        email,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };

  // Sign In
  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signin", {
        email,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/signout");
      alert(response.data.message);
    } catch (error) {
      alert("Error signing out");
    }
  };
  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Create Account</Components.Title>
          <Components.Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Components.Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <Components.Input type='password' placeholder='Password' /> */}
          <Components.Button onClick={handleSignUp}>Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>
      <Components.SignInContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Sign in</Components.Title>
          <Components.Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Components.Anchor href="#">Forgot your password?</Components.Anchor>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Components.Button onClick={handleSignIn}>Sigin In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>
      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>Sign In</Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph>
              Enter Your personal details and start journey with us
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>Sigin Up</Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
};
export default Auth;
