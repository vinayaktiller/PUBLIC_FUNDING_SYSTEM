from django.db import models
from .petitioners import Petitioner
from .pending_user import PendingUser
 

class InitiationNotification(models.Model):
    initiator = models.ForeignKey(Petitioner, on_delete=models.CASCADE, related_name='initiated_notifications')
    applicant = models.ForeignKey(PendingUser, on_delete=models.CASCADE, related_name='received_notifications')
    sent = models.BooleanField(default=False)
    viewed = models.BooleanField(default=False)
    reacted = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"InitiationNotification from {self.initiator} to {self.applicant}"

    def save(self, *args, **kwargs):
        if self._state.adding:  # Check if this is the first time saving the instance
            notification_id = f"{self.applicant.gmail}"
            print(f"Generated Notification ID: {notification_id}")
            from ..notification_utils import send_notification_to_initiator 

            # Example function to check if user is online
            if self.initiator.is_online:  # Assuming you have a method to check if user is online
                send_notification_to_initiator(self)
            else:
                # Wait for the user to come online and send the notification
                print("Initiator is not online. Waiting for user to come online.")

            print(f"Notification sent with ID: {notification_id}")

        return super().save(*args, **kwargs)
