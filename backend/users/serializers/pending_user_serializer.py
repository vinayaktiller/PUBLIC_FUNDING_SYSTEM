from rest_framework import serializers
from ..models import PendingUser, Petitioner
from address.models import Country, State, District, SubDistrict, Village
from .ProfilePictureSerializer import ProfilePictureSerializer

class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = ['id', 'name', 'status']

class SubDistrictSerializer(serializers.ModelSerializer):
    villages = VillageSerializer(many=True, read_only=True)

    class Meta:
        model = SubDistrict
        fields = ['id', 'name', 'villages']

class DistrictSerializer(serializers.ModelSerializer):
    subdistricts = SubDistrictSerializer(many=True, read_only=True)

    class Meta:
        model = District
        fields = ['id', 'name', 'subdistricts']

class StateSerializer(serializers.ModelSerializer):
    districts = DistrictSerializer(many=True, read_only=True)

    class Meta:
        model = State
        fields = ['id', 'name', 'districts']

class CountrySerializer(serializers.ModelSerializer):
    states = StateSerializer(many=True, read_only=True)

    class Meta:
        model = Country
        fields = ['id', 'name', 'states']  






class PendingUserSerializer(serializers.ModelSerializer):
    
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all())
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all())
    district = serializers.PrimaryKeyRelatedField(queryset=District.objects.all())
    subdistrict = serializers.PrimaryKeyRelatedField(queryset=SubDistrict.objects.all())
    village = serializers.PrimaryKeyRelatedField(queryset=Village.objects.all())

    class Meta:
        model = PendingUser
        fields = ['gmail', 'first_name', 'last_name', 'date_of_birth', 'gender', 'country', 'state', 'district', 'subdistrict', 'village', 'initiator_id', 'profile_picture']

    



class Pending_UserSerializer(serializers.ModelSerializer):
    
    # Use StringRelatedField to represent related objects as strings
    country = serializers.StringRelatedField()
    state = serializers.StringRelatedField()
    district = serializers.StringRelatedField()
    subdistrict = serializers.StringRelatedField()
    village = serializers.StringRelatedField()

    class Meta:
        model = PendingUser
        fields = ['gmail', 'first_name', 'last_name', 'date_of_birth', 'gender', 'country', 'state', 'district', 'subdistrict', 'village', 'initiator_id', 'profile_picture']


class InitiatorIdSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Petitioner
        fields = ['id', 'full_name', 'profile_picture', 'username']  # Add fields as needed

