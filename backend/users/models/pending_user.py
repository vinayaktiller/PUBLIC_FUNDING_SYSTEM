from django.db import models, transaction
from address.models import Country, State, District, SubDistrict, Village
from .petitioners import Petitioner

class PendingUser(models.Model):
    gmail = models.EmailField(unique=True, null=False, blank=False)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])

    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True)
    subdistrict = models.ForeignKey(SubDistrict, on_delete=models.SET_NULL, null=True)
    village = models.ForeignKey(Village, on_delete=models.SET_NULL, null=True)

    initiator_id = models.BigIntegerField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.gmail

    def save(self, *args, **kwargs):
        if self.initiator_id == 0:
            self.initiator_id = None
            self.is_verified = True
            self.verify_and_transfer()
        else:
            from ..channels.channelViews import send_notification_to_initiator 
            notification_id = f"{self.gmail}"
            print(f"Generated Notification ID: {notification_id}")

            # Call notification function with the notification ID
            print("send_notification_to_initiator is about to be called")
            send_notification_to_initiator(
                self.initiator_id,
                {
                    "message": f"Are you initiating {self.first_name} {self.last_name}?",
                    "notificationId": notification_id,
                },
            )
            print(f"Notification sent with ID: {notification_id}")
        
        return super().save(*args, **kwargs)

    @transaction.atomic
    def verify_and_transfer(self):
        try:
            if not self.gmail:
                raise ValueError("Gmail cannot be None")
            print(f"Transferring user with email: {self.gmail}")
            print(f"User is verified: {self.is_verified}")

            # Ensure all fields are not None or provide default values
            first_name = self.first_name or "Unknown"
            last_name = self.last_name or "Unknown"
            profile_picture_url = self.profile_picture.url if self.profile_picture and self.profile_picture.url else ''
            gender = self.gender[0] if self.gender else 'U'

            initiator = None
            if self.initiator_id:
                initiator = Petitioner.objects.filter(id=self.initiator_id).first()
                if not initiator:
                    print(f"No initiator found for ID: {self.initiator_id}")
                    return None

            print(f"Initiator details - First name: {initiator.first_name if initiator else 'N/A'}, Last name: {initiator.last_name if initiator else 'N/A'}")

            # Log fields for debugging
            print(f"First name: {first_name}")
            print(f"Last name: {last_name}")
            print(f"Profile picture URL: {profile_picture_url}")
            print(f"Gender: {gender}")
            print(f"Country: {self.country}")
            print(f"State: {self.state}")
            print(f"District: {self.district}")
            print(f"Subdistrict: {self.subdistrict}")
            print(f"Village: {self.village}")

            # Create Petitioner object
            petitioner = Petitioner.objects.create(
                gmail=self.gmail,
                first_name=first_name,
                last_name=last_name,
                profile_picture=profile_picture_url,
                date_of_birth=self.date_of_birth,
                gender=gender,
                country=self.country,
                state=self.state,
                district=self.district,
                subdistrict=self.subdistrict,
                village=self.village,
                initiator_id=initiator  # Pass the Petitioner instance
            )

            # Remove the pending user record
            self.delete()

            return petitioner

        except Exception as e:
            print(f"Error transferring user: {e}")
            raise e
