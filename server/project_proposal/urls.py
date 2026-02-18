from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    ProjectProposalList, 
    ProjectProposalDetail,
    ProjectActivitiesView
)

urlpatterns = [
    path('project-proposal/', ProjectProposalList.as_view(), name='project-proposal-list'),
    path('project-proposal/<int:pk>/', ProjectProposalDetail.as_view(), name='project-proposal-detail'),
    path('project-proposal/<int:project_proposal_id>/activities/', ProjectActivitiesView.as_view(), name='project-proposal-activities'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
