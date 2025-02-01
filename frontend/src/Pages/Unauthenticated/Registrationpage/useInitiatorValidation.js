import { useState } from 'react';

export function useInitiatorValidation() {
  const [initiatorDetails, setInitiatorDetails] = useState(null);
  const [error, setError] = useState('');

  const validateInitiatorID = async (id) => {
    if (id === '0') {
      setInitiatorDetails({
        profile_picture: {
          image: null,
          crop_x: 0,
          crop_y: 0,
          crop_width: 100,
          crop_height: 100,
          aspect_ratio: 1.0,
          zoom_level: 1.0,
          brightness: 1.0,
          contrast: 1.0,
        },
        full_name: 'First Member',
        username: 'N/A'
      });
      setError('');
      return true;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/validate-initiator/${id}/`);
      
      if (!response.ok) {
        throw new Error("Invalid Initiator ID");
      }
      
      const data = await response.json();
      setInitiatorDetails(data);
      setError('');
      return true;
    } catch (err) {
      setInitiatorDetails(null);
      setError(err.message || "Invalid Initiator ID.");
      return false;
    }
  };

  return { initiatorDetails, error, validateInitiatorID, setInitiatorDetails, setError };
}
