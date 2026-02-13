from django.urls import path
from .views import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    UserProfileList,
    CurrentUser,
    UpdateMyProfileView
)

urlpatterns = [
    # login
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),
    # refresh token
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # login
    path("profile/", UserProfileList.as_view(), name="profile"),
    path("profile/me/", CurrentUser.as_view(), name="my-profile"),
    path("profile/update/", UpdateMyProfileView.as_view(), name="update-profile")
]

urlpatterns = format_suffix_patterns(urlpatterns)