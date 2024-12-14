import React, { useState, useEffect } from 'react';
import './css/Registration.css';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [formData, setFormData] = useState({
    gmail: localStorage.getItem("user_email") || '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    country: '',
    state: '',
    district: '',
    subdistrict: '',
    village: '',

    profile_picture: null,
    initiator_id: '',
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [initiatorDetails, setInitiatorDetails] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/address/countries/')
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setFormData((prev) => ({ ...prev, country: countryId, state: '', district: '', subdistrict: '', village: '' }));
    setStates([]);
    setDistricts([]);
    setSubDistricts([]);
    setVillages([]);

    fetch(`http://127.0.0.1:8000/address/states/${countryId}/`)
      .then((response) => response.json())
      .then((data) => setStates(data))
      .catch((error) => console.error('Error fetching states:', error));
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setFormData((prev) => ({ ...prev, state: stateId, district: '', subdistrict: '', village: '' }));
    setDistricts([]);
    setSubDistricts([]);
    setVillages([]);

    fetch(`http://127.0.0.1:8000/address/districts/${stateId}/`)
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error('Error fetching districts:', error));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData((prev) => ({ ...prev, district: districtId, subdistrict: '', village: '' }));
    setSubDistricts([]);
    setVillages([]);

    fetch(`http://127.0.0.1:8000/address/subdistricts/${districtId}/`)
      .then((response) => response.json())
      .then((data) => setSubDistricts(data))
      .catch((error) => console.error('Error fetching subdistricts:', error));
  };

  const handleSubdistrictChange = (e) => {
    const subdistrictId = e.target.value;
    setFormData((prev) => ({ ...prev, subdistrict: subdistrictId, village: '' }));
    setVillages([]);

    fetch(`http://127.0.0.1:8000/address/villages/${subdistrictId}/`)
      .then((response) => response.json())
      .then((data) => setVillages(data))
      .catch((error) => console.error('Error fetching villages:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  const handleInitiatorIDChange = async (e) => {
    const id = e.target.value;
    setFormData((prev) => ({ ...prev, initiator_id: id }));

    if (id === '0') {
      // Allow if ID is 0
      setInitiatorDetails({
        profile_picture: '',  // Or any placeholder image
        full_name: 'First Member',
        username: 'N/A'
      });
      setError("");
    } else if (id) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/validate-initiator/${id}/`);
        
        if (!response.ok) {
          throw new Error("Invalid Initiator ID");
        }
        
        const data = await response.json();
        setInitiatorDetails(data);
        setError(""); // Clear error if valid
      } catch (err) {
        setInitiatorDetails(null);
        setError(err.message || "Invalid Initiator ID.");
      }
    } else {
      setInitiatorDetails(null);
      setError(""); // Clear error if empty
    }
  };

  

  const handleSubmit = async (e) => {
    console.log('Form data:', formData);
    
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/users/pending-users/', {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') // Include CSRF token 
          },
        body: formDataToSend,
      });
      if (response.ok) {
        const result = await response.json();
        console.log('User created successfully:', result);
        navigate('/waiting');
      } else {
        console.error('Error creating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (

    <form id="specific-form" onSubmit={handleSubmit} >
      <h2>Create Pending User</h2>

      <div className="form-group">
        <label>First Name:</label>
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Last Name:</label>
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Date of Birth:</label>
        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Country:</label>
        <select name="country" value={formData.country} onChange={handleCountryChange} required>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>State:</label>
        <select name="state" value={formData.state} onChange={handleStateChange} required disabled={!states.length}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>District:</label>
        <select name="district" value={formData.district} onChange={handleDistrictChange} required disabled={!districts.length}>
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Subdistrict:</label>
        <select
          name="subdistrict"
          value={formData.subdistrict}
          onChange={handleSubdistrictChange}
          required
          disabled={!subDistricts.length}
        >
          <option value="">Select Subdistrict</option>
          {subDistricts.map((subdistrict) => (
            <option key={subdistrict.id} value={subdistrict.id}>
              {subdistrict.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Village:</label>
        <select name="village" value={formData.village} onChange={handleChange} required disabled={!villages.length}>
          <option value="">Select Village</option>
          {villages.map((village) => (
            <option key={village.id} value={village.id}>
              {village.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Profile Picture:</label>
        <input type="file" name="profilePicture" onChange={handleFileChange} />
      </div>

      <div className="form-group">
        <label>Initiator ID:</label>
        <input
          type="number"
          name="initiatorId"
          value={formData.initiatorId}
          onChange={handleInitiatorIDChange}
          placeholder="Enter initiator ID"
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {initiatorDetails && (
          <div className="initiator-card">
            {initiatorDetails.profile_picture && (
              <img
                src={initiatorDetails.profile_picture}
                alt="Initiator Profile"
                style={{ width: "50px", height: "50px" }}
              />
            )}
            <h3>{initiatorDetails.full_name}</h3>
            <p>{initiatorDetails.username}</p>
            {initiatorDetails.full_name === 'First Member' && (
              <p>You are the first member, no need for an initiator.</p>
            )}
            {initiatorDetails.full_name !== 'First Member' && (
              <p>Are you sure this is the person who initiated you?</p>
            )}
          </div>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
    
  );
};

export default Registration

