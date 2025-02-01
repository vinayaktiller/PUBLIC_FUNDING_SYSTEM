import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as Login } from '../../User/userSlice';

function Waitingpage() {
  const user_email = localStorage.getItem("user_email");
  const [isInitiated, setIsInitiated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user_email) {
      // Construct WebSocket URL
      const ws = new WebSocket(`ws://localhost:8000/ws/waitingpage/${user_email}/`);

      // Log WebSocket connection open
      ws.onopen = () => {
        console.log('WebSocket connection opened:', ws.url);
      };

      // Listen for messages
      ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data); // Parse the incoming message
            console.log('Message received:', data); // Log received message
            if (data.isInitiated === true) { // Use === for comparison
                setIsInitiated(data.isInitiated);
                localStorage.setItem("user_id", data.user_id);
                console.log(data.user_id);
                console.log(data);
                console.log(data.isInitiated);
            }
        } catch (error) {
            console.error("Failed to parse WebSocket message", error);
        }
      };
    

      // Handle errors
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Log WebSocket connection close
      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
      };

      // Cleanup WebSocket connection
      return () => {
        ws.close();
      };
    }
  }, [user_email]);

  const handleOkClick = () => {
    

    dispatch(Login({ user_email }));

    navigate('/landing-page');
    //window.location.href = "/landing-page"; // Adjust the path to your landing page
  };

  return (
    <div>
      {isInitiated ? (
        <div>
          <p>Your initiation is successful!</p>
          <button onClick={handleOkClick}>OK</button>
        </div>
      ) : (
        <div>Waiting for initiation...</div>
      )}
    </div>
  );
}

export default Waitingpage;
