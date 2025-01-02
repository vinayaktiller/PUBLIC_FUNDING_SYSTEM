# your_app/models/pending_user.py
from django.db import models,transaction

from address.models import Country, State, District, SubDistrict, Village
from .petitioners import Petitioner




class PendingUser(models.Model):
    gmail = models.EmailField(unique=True,null=False,blank=False)
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
        if self.is_verified:
            initiator = None
            if self.initiator_id != 0:

                try:
                    initiator = Petitioner.objects.get(id=self.initiator_id)
                except Petitioner.DoesNotExist:
                    print(f"Initiator with ID {self.initiator_id} does not exist.")
                    return None
            
            # Transfer data to Petitioner
            petitioner = Petitioner.objects.create(
                gmail=self.gmail,
                first_name=self.first_name,
                last_name=self.last_name,
                profile_picture=self.profile_picture.url if self.profile_picture else None,
                date_of_birth=self.date_of_birth,
                gender=self.gender[0],
                country=self.country,
                state=self.state,
                district=self.district,
                subdistrict=self.subdistrict,
                village=self.village,
                initiator_id=initiator  # Set the Petitioner instance, not the integer ID
            )
            
            # Remove the pending user record
            self.delete()

            return petitioner


