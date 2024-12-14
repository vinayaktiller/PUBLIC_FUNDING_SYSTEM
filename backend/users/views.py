from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from . import utils
from .models.pending_user import PendingUser
from .models.petitioners import Petitioner

def UserCheck(email):
    try:
        petitioner = Petitioner.objects.get(gmail=email)
        return 'olduser', petitioner
    except Petitioner.DoesNotExist:
        try:
            pending_user = PendingUser.objects.get(gmail=email)
            return 'pendinguser', pending_user
        except PendingUser.DoesNotExist:
            return 'newuser', None

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginWithGoogle(APIView):

    def post(self, request):
        if 'code' in request.data.keys():
            code = request.data['code']
            id_token = utils.get_id_token_with_code_method_1(code)
            user_email = id_token['email']

            user_type, user = UserCheck(user_email)
            
            if user_type == 'olduser':
                tokens = get_tokens_for_user(user)
                return Response({
                    'user_type': user_type,
                    'user_email': user_email,
                    'tokens': tokens
                })
            elif user_type == 'pendinguser':
                return Response({
                    'user_type': user_type,
                    'user_email': user_email
                })
            elif user_type == 'newuser':
                return Response({
                    'user_type': user_type,
                    'user_email': user_email,
                    
                })

        return Response(status=status.HTTP_400_BAD_REQUEST)


