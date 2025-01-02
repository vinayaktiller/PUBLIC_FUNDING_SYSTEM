 # signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Petitioner
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import re

@receiver(post_save, sender=Petitioner)
def post_petitioner_creation(sender, instance, created, **kwargs):
     if created:
         # Send WebSocket message
         print(f'sending conformation to waiting page {instance.gmail}')
         channel_layer = get_channel_layer()
         sanitized_email = re.sub(r'[^a-zA-Z0-9]', '_', instance.gmail)
         group_name = f"waiting_{sanitized_email}"
         async_to_sync(channel_layer.group_send)(
             group_name,
             {
                 'type': 'waitingpage_message',
                 'message': {
                     'user_email': instance.gmail,
                     'isInitiated': True,
                 }
             }
         )
         print(f'New Petitioner created: {instance.gmail}')

