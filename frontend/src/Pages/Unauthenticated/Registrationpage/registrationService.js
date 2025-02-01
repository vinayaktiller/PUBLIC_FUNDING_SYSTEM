export const registrationService = {
    getCookie: (name) => {
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
    },
  
    submitRegistration: async (formData) => {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      console.log( registrationService.getCookie('csrftoken'))
      try {
        const response = await fetch('http://127.0.0.1:8000/users/pending-users/', {
          method: 'POST',
          headers: { 'X-CSRFToken': registrationService.getCookie('csrftoken') },
          body: formDataToSend,
        });
        
        if (response.ok) {
          const result = await response.json();
          return result;
        } else {
          throw new Error('Error creating user');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
      }
    }
  };