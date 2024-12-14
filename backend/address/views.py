from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Country, State, District, SubDistrict, Village
from .serializers import CountrySerializer, StateSerializer, DistrictSerializer, SubDistrictSerializer, VillageSerializer

@api_view(['GET'])
def get_countries(request):
    countries = Country.objects.all()
    serializer = CountrySerializer(countries, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_states(request, country_id):
    states = State.objects.all()
    serializer = StateSerializer(states, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_districts_by_state(request, state_id):
    districts = District.objects.filter(state_id=state_id)
    serializer = DistrictSerializer(districts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_subdistricts_by_district(request, district_id):
    subdistricts = SubDistrict.objects.filter(district_id=district_id)
    serializer = SubDistrictSerializer(subdistricts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_villages_by_subdistrict(request, subdistrict_id):
    villages = Village.objects.filter(subdistrict_id=subdistrict_id)
    serializer = VillageSerializer(villages, many=True)
    return Response(serializer.data)
