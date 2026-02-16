from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProjectProposalList, ProjectProposalDetail

urlpatterns = [
    path('project-proposal/', ProjectProposalList.as_view(), name='project-proposal-list'),
    path('project-proposal/<int:pk>/', ProjectProposalDetail.as_view(), name='project-proposal-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
