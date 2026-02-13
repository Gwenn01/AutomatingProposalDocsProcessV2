# auth
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
#drf
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#app
from .models import UserProfile
from .serializers import (
    RegistrationSerializer,
    UserSerializer,
    UserProfileUpdateSerializer
)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class UserProfileList(APIView):
    permission_classes = [AllowAny]
    # def get(self, request, format=None):
    #     users = UserProfile.objects.all()
    #     serializer = UserSerializer(users, many=True)
    #     return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = RegistrationSerializer(data=request.data)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
    
class CurrentUser(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request, format=None):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    
class UpdateMyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        profile = request.user.profile   # from OneToOneField related_name="profile"

        serializer = UserProfileUpdateSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)