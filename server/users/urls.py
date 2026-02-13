from django.urls import path
from .views import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # login
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),

    # refresh token
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
