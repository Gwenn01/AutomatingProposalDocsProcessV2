from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        credentials = {
            "email": attrs.get("email"),
            "password": attrs.get("password")
        }

        user = authenticate(**credentials)

        if user is None:
            raise AuthenticationFailed("Invalid email or password")

        data = super().get_token(user)

        return {
            "refresh": str(data),
            "access": str(data.access_token),
            "user_id": user.id,
            "username": user.username,
            "email": user.email
        }
# REGISTRATION SERIALIZER
class RegistrationSerializer(serializers.ModelSerializer):
     # USER fields
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    # PROFILE fields (not in User model)
    role = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True)
    campus = serializers.CharField(write_only=True)
    department = serializers.CharField(write_only=True)
    position = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "role",
            "name",
            "campus",
            "department",
            "position",
        ]
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use")
        return value
    
    def create(self, validated_data):
         # remove profile fields
        role = validated_data.pop("role")
        name = validated_data.pop("name")
        campus = validated_data.pop("campus")
        department = validated_data.pop("department")
        position = validated_data.pop("position", "")

        password = validated_data.pop("password")

        # create USER
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(password)
        user.save()

        # create PROFILE
        UserProfile.objects.create(
            user=user,
            role=role,
            name=name,
            campus=campus,
            department=department,
            position=position,
        )

        return user  
 
 
 # GET PROFILE 
 # return the profile serializer to get profile   
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "role",
            "name",
            "campus",
            "department",
            "position",
            "created_at"
        ]
      
# return the user serializer to get user and connect to profile
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)  # related_name="profile"

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "profile",
        ]
        
# UPDATE PROFILE SERIALIZER
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    # fields from User model
    username = serializers.CharField(source="user.username", required=False)
    email = serializers.EmailField(source="user.email", required=False)

    class Meta:
        model = UserProfile
        fields = [
            "username",
            "email",
            "role",
            "name",
            "campus",
            "department",
            "position",
        ]

    def update(self, instance, validated_data):
        # --- Update USER ---
        user_data = validated_data.pop("user", {})

        user = instance.user
        if "username" in user_data:
            user.username = user_data["username"]
        if "email" in user_data:
            user.email = user_data["email"]
        user.save()

        # --- Update PROFILE ---
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance