import React from "react";
import { useDispatch } from 'react-redux';
import { login as Login } from '../../User/userSlice';
import GoogleButton from "react-google-button";
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";
import Cookies from 'js-cookie';



function Loginpage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();




  
  const handleSuccess = (codeResponse) => {
    const authorizationCode = codeResponse.code;

    fetch("http://127.0.0.1:8000/users/login/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: authorizationCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { user_type, user_email, tokens, } = data;

        if (user_type === 'olduser') {
          Cookies.set('access_token', tokens.access);
          Cookies.set('refresh_token', tokens.refresh);
          localStorage.setItem("user_id", data["user_id"]);
          dispatch(Login({ user_email }));
          
          navigate('/home');  // Redirect to main page or dashboard
          window.location.reload();

        } else if (user_type === 'pendinguser') {
          navigate('/waiting');  // Redirect to Waitingpage
          
        } else if (user_type === 'newuser') {
          localStorage.setItem("user_email", data["user_email"]);
          navigate('/register');  // Redirect to Registration page
        }
      })
      .catch((error) => {
        console.error("Error exchanging authorization code:", error);
      });
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    flow: "auth-code",
  });

  return (
    <div>
      <GoogleButton onClick={login} label="Sign in with Google" />
      
    </div>
  );
}

export default Loginpage;


  





  
  