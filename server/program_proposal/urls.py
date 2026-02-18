from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    ProgramProposalList, 
    ProgramProposalDetail,
    ProgramProjectsView
)

urlpatterns = [
    # implementor urls
    path("program-proposal/", ProgramProposalList.as_view(), name="program-proposal"),
    path("program-proposal/<int:pk>/", ProgramProposalDetail.as_view(), name="program-proposal-detail"),
    path("program-proposal/<int:program_proposal_id>/projects/", ProgramProjectsView.as_view(), name="program-proposal-projects"),
]

urlpatterns = format_suffix_patterns(urlpatterns)