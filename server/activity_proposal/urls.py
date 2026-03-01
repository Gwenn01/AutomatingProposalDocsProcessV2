from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ActivityProposalList, ActivityProposalDetail, UpdateActivitySaveHistoryView

urlpatterns = [
    path('activity-proposal/', ActivityProposalList.as_view(), name='activity-proposal-list'),
    path('activity-proposal/<int:pk>/', ActivityProposalDetail.as_view(), name='activity-proposal-detail'),
    path('activity-proposal/<int:pk>/update-activity-save-history/', UpdateActivitySaveHistoryView.as_view(), name='update-activity-save-history')
]

urlpatterns = format_suffix_patterns(urlpatterns)