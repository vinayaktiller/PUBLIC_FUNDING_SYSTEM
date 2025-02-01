import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UUseDebounce from '../../Utils/UUseDebounce';

function LandingPage() {
  const [username, setUsername] = useState('');
  const [isUnique, setIsUnique] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function
  const debouncedUsername = UUseDebounce(username, 500); // Debounce input with 500ms delay

  useEffect(() => {
    if (debouncedUsername) {
      checkUsername(debouncedUsername);
    }
  }, [debouncedUsername]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setIsUnique(null);
    setError(null); // Clear any previous errors
  };

  const checkUsername = async (debouncedUsername) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/users/check-username/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: debouncedUsername })
      });
      const data = await response.json();
      setIsUnique(data.isUnique);
    } catch (error) {
      console.error("Error checking username uniqueness", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem('user_id'); // Get user_id from local storage
    console.log("isUnique:", isUnique); // Log to check isUnique value 
    console.log("user_id:", user_id);

    if (isUnique && user_id) {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/save-username/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, user_id })
        });
        const data = await response.json();
        if (response.ok) {
          setIsSubmitted(true);
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error("Error saving username", error);
        setError("An unexpected error occurred. Please try again.");
      }
    } else {
      alert("Username is not unique or invalid user_id. Please choose another one.");
    }
  };

  return (
    <div>
      <h1>Choose Your Username</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input 
            type="text" 
            value={username} 
            onChange={(e) => handleUsernameChange(e)}
            style={{
              borderColor: isUnique === null ? 'black' : isUnique ? 'green' : 'red',
              borderWidth: '2px'
            }}
            required
          />
        </label>
        {isUnique === false && <p style={{ color: 'red' }}>Username is already taken. Please choose another one.</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Submit</button>
      </form>
      {isSubmitted && (
        <div>
          <p>Username has been successfully set!</p>
          <button onClick={() => navigate('/home')}>Navigate to Home</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
