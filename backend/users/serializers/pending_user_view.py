from rest_framework import generics
from ..models import PendingUser, Petitioner
from .pending_user_serializer import PendingUserSerializer, InitiatorIdSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view



# List and Create View
class PendingUserListCreateView(generics.ListCreateAPIView):
    queryset = PendingUser.objects.all()
    serializer_class = PendingUserSerializer

    def create(self, request, *args, **kwargs):
        # Extract data from the request
        data = request.data
        # Initialize the serializer with the provided data
        serializer = self.get_serializer(data=data)
        
        # Validate the data
        serializer.is_valid(raise_exception=True)
        
        # Perform the creation of the PendingUser instance
        self.perform_create(serializer)
        
        # Return the serialized data in the response
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Retrieve, Update, and Delete View
class PendingUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PendingUser.objects.all()
    serializer_class = PendingUserSerializer


class ValidateInitiatorAPIView(APIView):
    def get(self, request, initiator_id):
        try:
            # Fetch petitioner with the given ID
            petitioner = Petitioner.objects.get(id=initiator_id)
            serializer = InitiatorIdSerializer(petitioner)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Petitioner.DoesNotExist:
            return Response(
                {"message": "Initiator ID does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        
@api_view(['POST'])
def create_pending_user(request):
    serializer = PendingUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer)
        print(serializer.errors)  # Log the validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
