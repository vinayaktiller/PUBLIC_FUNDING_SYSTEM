from rest_framework import serializers
from .models import Country, State, District, SubDistrict, Village

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name']

class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'state']

class SubDistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubDistrict
        fields = ['id', 'name', 'district']

class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = ['id', 'name', 'subdistrict', 'status']