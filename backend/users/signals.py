 # signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Petitioner, InitiationNotification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import re
from .notification_utils import send_notification_to_initiator

from django.dispatch import Signal

@receiver(post_save, sender=Petitioner)
def post_petitioner_creation(sender, instance, created, **kwargs):
    if created:
        # Send WebSocket message
        print(f'sending confirmation to waiting page {instance.gmail}')
        print(instance.id)
        channel_layer = get_channel_layer()
        sanitized_email = re.sub(r'[^a-zA-Z0-9]', '_', instance.gmail)
        group_name = f"waiting_{sanitized_email}"
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'waitingpage_message',
                'user_email': instance.gmail,
                'isInitiated': True,
                'user_id': instance.id
            }
        )
        print(f'New Petitioner created: {instance.gmail}')

user_online = Signal()
user_offline = Signal()

@receiver(user_online)
def handle_user_online(sender, user_id, **kwargs):
    
    # Update user's online status
    Petitioner.objects.filter(id=user_id).update(is_online=True)

    # Fetch and send pending notifications for the user
    pending_notifications = InitiationNotification.objects.filter(initiator_id=user_id, reacted=False)
    print(f"Number of pending notifications: {len(pending_notifications)}")
    
    for notification in pending_notifications:
        send_notification_to_initiator(notification)
        print(f"Notification sent to {notification.initiator_id}")
        notification.sent = True
        notification.save()


@receiver(user_offline)
def handle_user_offline(sender, user_id, **kwargs):
    Petitioner.objects.filter(id=user_id).update(is_online=False)



