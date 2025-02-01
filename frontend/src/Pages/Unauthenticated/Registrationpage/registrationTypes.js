export const FormDataInitialState = {
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
    initiator_id: '',
    profile_picture: null, 
  };