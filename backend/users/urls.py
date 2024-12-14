from django.urls import path
from .views import LoginWithGoogle
from .serializers.pending_user_view import PendingUserListCreateView, PendingUserDetailView, ValidateInitiatorAPIView, create_pending_user

urlpatterns = [
    path('login/google/', LoginWithGoogle.as_view(), name='login_with_google'),

    # List all pending users or create a new one
    #path('pending-users/', PendingUserListCreateView.as_view(), name='pending-user-list-create'),

    path('pending-users/', create_pending_user, name='pending-user-list-create'),

    # Retrieve, update, or delete a specific pending user by ID
    path('pending-users/<int:pk>/', PendingUserDetailView.as_view(), name='pending-user-detail'),

    path('validate-initiator/<int:initiator_id>/', ValidateInitiatorAPIView.as_view(), name='validate-initiator'),
]






