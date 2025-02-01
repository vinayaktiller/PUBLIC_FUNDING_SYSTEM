from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from users.models import PendingUser

# def send_notification_to_initiator(initiator_id, message):
#     channel_layer = get_channel_layer()
#     group_name = f"notifications_{initiator_id}"
#     print("Group name is " + group_name)

#     async_to_sync(channel_layer.group_send)(
#         group_name,
#         {
#             "type": "send_notification",
#             "notification": message
#         }
#     )
#     print("Notification sent to initiator with message: " + str(message))

def handle_response_from_user( notification_id, response):
    """
    Handle the response from the user and update PendingUser accordingly.
    """
    try:
        # Extract PendingUser ID and email from notification ID
        email = notification_id
        pending_user = PendingUser.objects.get(gmail=email)

        if response == "yes":
            pending_user.is_verified = True
            pending_user.verify_and_transfer()
            print(f"User {email} verified and transferred to Petitioner.")
        else:
            # Handle rejection logic (e.g., deletion or flagging)
            print(f"User {email} was not verified.")
            pending_user.delete()
    except Exception as e:
        print(f"Error handling response: {e}")
    return response

