from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import ProgramProposalList

urlpatterns = [
    path("program-proposal/", ProgramProposalList.as_view(), name="program-proposal"),
]

urlpatterns = format_suffix_patterns(urlpatterns)