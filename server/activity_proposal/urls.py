from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ActivityProposalList, ActivityProposalDetail

urlpatterns = [
    path('activity-proposal/', ActivityProposalList.as_view(), name='activity-proposal-list'),
    path('activity-proposal/<int:pk>/', ActivityProposalDetail.as_view(), name='activity-proposal-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)