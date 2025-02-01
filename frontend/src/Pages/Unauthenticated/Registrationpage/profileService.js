export const profileService = {
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
  
    uploadProfilePicture: async (croppedImage) => {
      if (croppedImage) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
  
        const formData = new FormData();
        formData.append('file', blob, 'profile-picture.jpg');
        console.log( profileService.getCookie('csrftoken'))
  
        try {
          const response = await fetch('http://127.0.0.1:8000/users/upload-profile-picture/', {
            method: 'POST',
            headers: { 'X-CSRFToken': profileService.getCookie('csrftoken') },
            body: formData,
          });
  
          if (response.ok) {
            const result = await response.json();
            return result;
          } else {
            throw new Error('Error uploading profile picture');
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          throw error;
        }
      } else {
        throw new Error('No cropped image to upload');
      }
    }
  };
  