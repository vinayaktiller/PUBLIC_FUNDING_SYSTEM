from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers.pending_user_serializer import Pending_UserSerializer

def send_notification_to_initiator(notification):
    applicant_data = Pending_UserSerializer(notification.applicant).data
    channel_layer = get_channel_layer()
    event_data = {
        "type": "notification.message",
        "notification": {
            "message": f"Are you initiating {notification.applicant.first_name} {notification.applicant.last_name}?",
            "notificationId": notification.applicant.gmail,  # Ensure this is the correct field
            "applicant_details": applicant_data
        }
    }
    print(f"Event data being sent: {event_data}")
    async_to_sync(channel_layer.group_send)(
        f"notifications_{notification.initiator_id}",
        event_data
    )
