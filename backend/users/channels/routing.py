from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from .consumers import NotificationConsumer, WaitingpageConsumer
from django.core.asgi import get_asgi_application

from django.urls import re_path





# yourapp/routing.py

websocket_urlpatterns = [
    re_path(r'ws/notifications/(?P<user_id>\w+)/$', NotificationConsumer.as_asgi()),
    re_path(r'ws/waitingpage/(?P<user_email>[\w.@+-]+)/$', WaitingpageConsumer.as_asgi()),
    
]
