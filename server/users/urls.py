from django.urls import path
from .views import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    UserProfileList,
    CurrentUser,
    UpdateMyProfileView,
    UserProfileDetail ,
    AdminUserList,
    AdminUserDetail,
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
    #  Get user by ID
    path("profile/<int:pk>/", UserProfileDetail.as_view(), name="user-detail"),
    # update profile
    path("profile/update/", UpdateMyProfileView.as_view(), name="update-profile"),
    # admin user list endpoint
    path("admin/", AdminUserList.as_view(), name="admin-user-list"),
    path("admin/<int:pk>/", AdminUserDetail.as_view(), name="admin-user-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)