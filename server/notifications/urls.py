from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from .views import NotificationList, NotificationDetails

urlpatterns = [
    path('notifications/', NotificationList.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', NotificationDetails.as_view(), name='notification-detail')
]

urlpatterns = format_suffix_patterns(urlpatterns)