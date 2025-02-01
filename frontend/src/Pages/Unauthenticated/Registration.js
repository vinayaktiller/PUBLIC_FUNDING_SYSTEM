import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormDataInitialState } from './Registrationpage/registrationTypes';
import { useAddressSelection } from './Registrationpage/useAddressSelection';
import { useInitiatorValidation } from './Registrationpage/useInitiatorValidation';
import { registrationService } from './Registrationpage/registrationService';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Slider from '@mui/material/Slider'; // For zoom and rotation sliders
import './css/Registration.css';
import Cookies from 'js-cookie';
import {profileService} from './Registrationpage/profileService';

function Registration() {
  const navigate = useNavigate();
  const {
    countries,
    states,
    districts,
    subDistricts,
    villages,
    fetchCountries,
    fetchStates,
    fetchDistricts,
    fetchSubdistricts,
    fetchVillages,
    setStates,
    setDistricts,
    setSubDistricts,
    setVillages,
  } = useAddressSelection();

  const { initiatorDetails, error, validateInitiatorID } = useInitiatorValidation();

  const [formData, setFormData] = useState(FormDataInitialState);
  const [src, setSrc] = useState(null); // Source image
  const [crop, setCrop] = useState({ aspect: 100 / 110 }); // Fixed aspect ratio
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image result
  const [zoom, setZoom] = useState(1); // Zoom level
  const [rotation, setRotation] = useState(0); // Rotation angle
  const imgRef = useRef(null); // Reference to the image element

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleAddressChange = async (type, value) => {
    switch (type) {
      case 'country':
        setFormData((prev) => ({
          ...prev,
          country: value,
          state: '',
          district: '',
          subdistrict: '',
          village: '',
        }));
        setStates([]);
        setDistricts([]);
        setSubDistricts([]);
        setVillages([]);
        await fetchStates(value);
        break;
      case 'state':
        setFormData((prev) => ({
          ...prev,
          state: value,
          district: '',
          subdistrict: '',
          village: '',
        }));
        setDistricts([]);
        setSubDistricts([]);
        setVillages([]);
        await fetchDistricts(value);
        break;
      case 'district':
        setFormData((prev) => ({
          ...prev,
          district: value,
          subdistrict: '',
          village: '',
        }));
        setSubDistricts([]);
        setVillages([]);
        await fetchSubdistricts(value);
        break;
      case 'subdistrict':
        setFormData((prev) => ({
          ...prev,
          subdistrict: value,
          village: '',
        }));
        setVillages([]);
        await fetchVillages(value);
        break;
      default:
        break;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle crop completion
  const onCropComplete = (crop) => {
    if (src && imgRef.current) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImage(croppedImageUrl);
    }
  };

  // Generate the cropped image
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL('image/jpeg'); // Return as base64
  };

  // Handle upload to backend
  const handleUpload = async () => {
    try {
      const result = await profileService.uploadProfilePicture(croppedImage);
      const filePath = result.file_path;
      setFormData((prev) => ({ ...prev, profile_picture: filePath }));
      alert('Profile picture uploaded successfully!');
    } catch (error) {
      alert(error.message);
    }
  };
  

  const handleInitiatorIDChange = async (e) => {
    const id = e.target.value;
    setFormData((prev) => ({ ...prev, initiator_id: id }));
    await validateInitiatorID(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await registrationService.submitRegistration(formData);
      console.log(formData);
      navigate('/waiting');
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  return (
    <form id="specific-form" onSubmit={handleSubmit}>
      {/* Form fields for first name, last name, date of birth, gender, etc. */}
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
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

      {/* Address selection fields */}
      <div className="form-group">
        <label>Country:</label>
        <select
          name="country"
          value={formData.country}
          onChange={(e) => handleAddressChange('country', e.target.value)}
          required
        >
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
        <select
          name="state"
          value={formData.state}
          onChange={(e) => handleAddressChange('state', e.target.value)}
          required
          disabled={!states.length}
        >
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
        <select
          name="district"
          value={formData.district}
          onChange={(e) => handleAddressChange('district', e.target.value)}
          required
          disabled={!districts.length}
        >
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
          onChange={(e) => handleAddressChange('subdistrict', e.target.value)}
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
        <select
          name="village"
          value={formData.village}
          onChange={handleChange}
          required
          disabled={!villages.length}
        >
          <option value="">Select Village</option>
          {villages.map((village) => (
            <option key={village.id} value={village.id}>
              {village.name}
            </option>
          ))}
        </select>
      </div>

      {/* Profile picture upload and cropping */}
      <div className="form-group">
        <label>Upload Profile Picture</label>
        <input type="file" accept="image/*" onChange={onSelectFile} />

        {src && (
          <div>
            <h2>Crop Your Image</h2>
            <ReactCrop
              src={src}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={onCropComplete}
              aspect={100 / 110} // Fixed aspect ratio
              minWidth={100} // Minimum crop width
              minHeight={110} // Minimum crop height
            >
              <img
                ref={imgRef}
                src={src}
                alt="Crop me"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              />
            </ReactCrop>

            {/* Zoom slider */}
            <div className="slider-container">
              <label>Zoom:</label>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, newValue) => setZoom(newValue)}
              />
            </div>

            {/* Rotation slider */}
            <div className="slider-container">
              <label>Rotation:</label>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e, newValue) => setRotation(newValue)}
              />
            </div>

            <button type="button" onClick={handleUpload}>
              Upload Cropped Image
            </button>
          </div>
        )}

        {croppedImage && (
          <div>
            <h2>Cropped Preview</h2>
            <img src={croppedImage} alt="Cropped" style={{ borderRadius: '50%' }} />
          </div>
        )}
      </div>

      {/* Initiator ID and details */}
      <div className="form-group">
        <label>Initiator ID:</label>
        <input
          type="text"
          name="initiator_id"
          value={formData.initiator_id}
          onChange={handleInitiatorIDChange}
          placeholder="Enter Initiator ID"
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Submit button */}
      <button type="submit">Submit</button>
    </form>
  );
}

export default Registration;