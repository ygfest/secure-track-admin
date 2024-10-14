import React, { useState } from "react";
import googleLogo from "../assets/google.svg";
import { ImSpinner2 } from "react-icons/im";
import "../index.css";

export default function GoogleButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = () => {
    setIsSigningIn(true);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${
      window.location.origin
    }/auth/callback&response_type=token&scope=openid%20email%20profile`;

    window.location.href = authUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="btn bg-white text-black flex items-center justify-center google-button hover:bg-black hover:text-white"
      disabled={isSigningIn}
    >
      <img
        src={googleLogo}
        alt="google-logo"
        width={16}
        height={16}
        className="mr-2"
      />
      {isSigningIn ? (
        <ImSpinner2 className="animate-spin text-2xl text-primary" />
      ) : (
        "Google"
      )}
    </button>
  );
}
