from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from . import utils
from .models.pending_user import PendingUser
from .models.petitioners import Petitioner
import json
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
                    'tokens': tokens,
                    'user_id': user.id
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
    

class CheckUsernameAPIView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        is_unique = not Petitioner.objects.filter(username=username).exists()
        return Response({'isUnique': is_unique})

class SaveUsernameAPIView(APIView):
    def post(self, request):
        data = request.data
        username = data.get('username')
        user_id = data.get('user_id')
        
        if user_id:
            try:
                petitioner = Petitioner.objects.get(id=user_id)
                petitioner.username = username
                petitioner.save()
                return Response({'success': True})
            except Petitioner.DoesNotExist:
                return Response({'success': False, 'error': 'Petitioner not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': False, 'error': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)


from django.http import JsonResponse

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


class UploadProfilePictureView(APIView):
    def post(self, request, *args, **kwargs):
        if 'file' in request.FILES:
            profile_picture = request.FILES['file']
            file_path = default_storage.save(f'profile_pictures/{profile_picture.name}', ContentFile(profile_picture.read()))
            return Response({'message': 'Profile picture uploaded successfully!', 'file_path': file_path}, status=status.HTTP_200_OK)
        return Response({'error': 'Failed to upload profile picture.'}, status=status.HTTP_400_BAD_REQUEST)


