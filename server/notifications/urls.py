from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import NotificationList

urlpatterns = [
    path('admin/notifications/', NotificationList.as_view(), name='notification-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)