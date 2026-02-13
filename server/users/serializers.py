from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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
            raise Exception("Invalid email or password")

        data = super().get_token(user)

        return {
            "refresh": str(data),
            "access": str(data.access_token),
            "user_id": user.id,
            "email": user.email
        }

class UserProfileSerializer(serializers.ModelSerializer):
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
    
    