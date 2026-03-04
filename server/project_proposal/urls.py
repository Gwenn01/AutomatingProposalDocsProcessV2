from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    ProjectProposalList, 
    ProjectProposalDetail,
    ProjectActivitiesView,
    UpdateProjectSaveHistoryView,
    ProjectListHistoryView
)

urlpatterns = [
    path('project-proposal/', ProjectProposalList.as_view(), name='project-proposal-list'),
    path('project-proposal/<int:pk>/', ProjectProposalDetail.as_view(), name='project-proposal-detail'),
    path('project-proposal/<int:project_proposal_id>/activities/', ProjectActivitiesView.as_view(), name='project-proposal-activities'),
    path('project-proposal/<int:pk>/update-project-save-history/', UpdateProjectSaveHistoryView.as_view(), name='update-project-save-history'),
    path('project-proposal/<int:proposal_id>/history-list/', ProjectListHistoryView.as_view(), name='project-list-history')
]

urlpatterns = format_suffix_patterns(urlpatterns)
