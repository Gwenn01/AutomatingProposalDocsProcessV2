from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProgramProposalList, ProgramProposalDetail

urlpatterns = [
    path("program-proposal/", ProgramProposalList.as_view(), name="program-proposal"),
    path("program-proposal/<int:pk>/", ProgramProposalDetail.as_view(), name="program-proposal-detail"),
]

urlpatterns = format_suffix_patterns(urlpatterns)