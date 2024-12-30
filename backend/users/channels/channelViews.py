from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def send_notification_to_initiator(initiator_id, message):
    channel_layer = get_channel_layer()
    group_name = f"notifications_{initiator_id}"
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_notification",
            "notification": message
        }
    )
