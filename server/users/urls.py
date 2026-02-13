from django.urls import path
from .views import EmailTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.urlpatterns import format_suffix_patterns
from .views import UserProfileList

urlpatterns = [
    # login
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),
    # refresh token
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # login
    path("profile/", UserProfileList.as_view(), name="profile"),
    
]

urlpatterns = format_suffix_patterns(urlpatterns)