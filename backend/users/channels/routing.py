from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from .consumers import NotificationConsumer

from django.core.asgi import get_asgi_application




from django.urls import re_path





# yourapp/routing.py



websocket_urlpatterns = [
    re_path(r'ws/notifications/', NotificationConsumer.as_asgi()),
]
