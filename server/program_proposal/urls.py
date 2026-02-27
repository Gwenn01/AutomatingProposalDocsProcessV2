from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    ProgramProposalList, 
    ProgramProposalDetail,
    ProgramProjectsView,
    ProgramListHistoryView,
    ProgramProposalHistoryDetails,
)

urlpatterns = [
    # implementor urls
    path("program-proposal/", ProgramProposalList.as_view(), name="program-proposal"),
    path("program-proposal/<int:pk>/", ProgramProposalDetail.as_view(), name="program-proposal-detail"),
    path("program-proposal/<int:program_proposal_id>/projects/", ProgramProjectsView.as_view(), name="program-proposal-projects"),
    path("program-proposal/<int:proposal_id>/history-list/", ProgramListHistoryView.as_view(), name="program-proposal-history-list"),
    #path("program-proposal/<int:pk>/history-details/", ProgramProposalHistoryDetails.as_view(), name="program-proposal-history-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)