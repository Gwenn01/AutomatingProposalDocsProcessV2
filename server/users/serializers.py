from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

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
