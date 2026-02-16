from django.urls import path
from .views import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    UserProfileList,
    CurrentUser,
    UpdateMyProfileView,
    UserProfileDetail  # ✅ ADD THIS IMPORT
)

urlpatterns = [
    # login
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),
    # refresh token
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # registration
    path("profile/", UserProfileList.as_view(), name="profile"),
    # current user
    path("profile/me/", CurrentUser.as_view(), name="my-profile"),
    # update profile
    path("profile/update/", UpdateMyProfileView.as_view(), name="update-profile"),
    # ✅ ADD THIS NEW ENDPOINT - Get user by ID
    path("<int:pk>/", UserProfileDetail.as_view(), name="user-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)